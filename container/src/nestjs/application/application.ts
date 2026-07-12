/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file stackra-application.ts
 * @module @stackra/container/nestjs
 * @description Enterprise NestJS application wrapper.
 *   Wraps NestFactory.create() with production-ready defaults:
 *   validation, CORS, helmet, compression, global prefix, graceful shutdown,
 *   and logging. Single entry point for bootstrapping any @stackra backend.
 */

// Triple-slash reference so downstream packages that transitively
// typecheck this file pick up the ambient module declarations for
// the optional `helmet` and `cookie-parser` middleware. They are
// lazy-loaded via `await import(...)` below and this package does
// not carry them as regular dependencies.
/// <reference path="../../@types/nestjs-optional-middleware.d.ts" />

import { NestFactory } from '@nestjs/core';
import {
  ValidationPipe,
  Logger,
  type INestApplication,
  type INestApplicationContext,
  type Type,
} from '@nestjs/common';
import type {
  IApplicationOptions,
  ICliOptions,
  IWorkerOptions,
  IMicroserviceOptions,
} from './application-options.interface';
import { ApplicationBuilder } from './application-builder';

/**
 * Enterprise NestJS application wrapper.
 *
 * Provides a single, declarative entry point for bootstrapping a production-ready
 * NestJS application with all recommended middleware and configuration pre-applied.
 *
 * @example
 * ```typescript
 * import { Application } from '@stackra/container/nestjs';
 * import { AppModule } from './app.module';
 *
 * await Application.create(AppModule, {
 *   port: 3000,
 *   prefix: 'api',
 *   cors: true,
 *   helmet: true,
 *   compression: true,
 *   validation: true,
 *   swagger: { title: 'MNGO API', version: '1.0.0' },
 *   shutdown: { graceful: true, timeout: 10_000 },
 * });
 * ```
 */
export class Application {
  private static readonly logger = new Logger('Application');

  /**
   * Create a fluent builder for configuring the application.
   *
   * @param module - The root NestJS module class
   * @returns A chainable ApplicationBuilder instance
   *
   * @example
   * ```typescript
   * await Application
   *   .builder(AppModule)
   *   .withPort(3000)
   *   .withPrefix('api')
   *   .withCors()
   *   .withHelmet()
   *   .withValidation()
   *   .withGracefulShutdown()
   *   .start();
   * ```
   */
  public static builder(module: Type<any>): ApplicationBuilder {
    return new ApplicationBuilder(module);
  }

  /**
   * Create and start a fully-configured NestJS application.
   *
   * Applies all production middleware and configuration in the correct order:
   * 1. Create app with optional logger
   * 2. Apply security middleware (helmet, CORS)
   * 3. Apply performance middleware (compression)
   * 4. Apply global prefix and versioning
   * 5. Apply global pipes (validation)
   * 6. Apply global filters (exception handling)
   * 7. Apply global interceptors (response envelope, logging, timeout)
   * 8. Setup Swagger (if enabled)
   * 9. Enable shutdown hooks
   * 10. Start listening
   *
   * @param module - The root NestJS module class
   * @param options - Application configuration options
   * @returns The running NestJS application instance
   */
  public static async create(
    module: Type<any>,
    options: IApplicationOptions = {}
  ): Promise<INestApplication> {
    const app = await NestFactory.create(module, {
      bufferLogs: true,
      abortOnError: options.abortOnError ?? false,
    });

    await Application.configure(app, options);
    await Application.start(app, options);

    return app;
  }

  /**
   * Configure an existing NestJS application with production defaults.
   * Useful when you need to create the app yourself but want the standard config.
   *
   * @param app - Existing NestJS application instance
   * @param options - Configuration options
   */
  public static async configure(
    app: INestApplication,
    options: IApplicationOptions = {}
  ): Promise<void> {
    // ═══════════════════════════════════════════════════════════════════════
    // Security Middleware
    // ═══════════════════════════════════════════════════════════════════════
    if (options.helmet !== false) {
      try {
        const helmet = (await import('helmet')).default;
        app.use(helmet(typeof options.helmet === 'object' ? options.helmet : {}));
        Application.logger.debug('Helmet enabled');
      } catch {
        Application.logger.warn('helmet not installed — skipping');
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Performance Middleware
    // ═══════════════════════════════════════════════════════════════════════
    if (options.compression !== false) {
      try {
        const compression = (await import('compression')).default;
        app.use(compression(typeof options.compression === 'object' ? options.compression : {}));
        Application.logger.debug('Compression enabled');
      } catch {
        Application.logger.warn('compression not installed — skipping');
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Cookie Parser
    // ═══════════════════════════════════════════════════════════════════════
    if (options.cookieParser !== false) {
      try {
        const cookieParser = (await import('cookie-parser')).default;
        app.use(cookieParser(options.cookieSecret));
        Application.logger.debug('Cookie parser enabled');
      } catch {
        // Optional — not all apps need cookies
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CORS
    // ═══════════════════════════════════════════════════════════════════════
    if (options.cors !== false) {
      const corsOptions =
        typeof options.cors === 'object'
          ? options.cors
          : {
              origin: true,
              credentials: true,
              methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
              allowedHeaders: [
                'Content-Type',
                'Authorization',
                'Accept',
                'X-Tenant-ID',
                'X-Language',
                'X-API-Key',
                'X-Request-ID',
                'X-Correlation-ID',
              ],
              exposedHeaders: [
                'X-Request-ID',
                'X-Correlation-ID',
                'X-RateLimit-Limit',
                'X-RateLimit-Remaining',
                'X-RateLimit-Reset',
              ],
              maxAge: 86400, // 24 hours preflight cache
            };
      app.enableCors(corsOptions);
      Application.logger.debug('CORS enabled');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Global Prefix
    // ═══════════════════════════════════════════════════════════════════════
    if (options.prefix) {
      app.setGlobalPrefix(options.prefix, {
        exclude: options.prefixExclude ?? ['health', 'graphql', 'metrics', 'ready', 'live'],
      });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Global Validation Pipe
    // ═══════════════════════════════════════════════════════════════════════
    if (options.validation !== false) {
      const validationOptions = typeof options.validation === 'object' ? options.validation : {};
      app.useGlobalPipes(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          transformOptions: { enableImplicitConversion: true },
          stopAtFirstError: false,
          ...validationOptions,
        })
      );
      Application.logger.debug('ValidationPipe enabled');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Shutdown Hooks
    // ═══════════════════════════════════════════════════════════════════════
    // NOTE: The optional `http-terminator` integration was removed because the
    // package is not installed in this workspace and the dynamic import broke
    // downstream typechecks (TS2307). NestJS' built-in shutdown hooks already
    // run module lifecycle handlers and stop the HTTP server gracefully; this
    // is sufficient for our deployment topology. If per-connection draining is
    // needed in the future, add `http-terminator` (plus types) as a real
    // dependency and reintroduce the wrapper here.
    if (options.shutdown?.graceful !== false) {
      app.enableShutdownHooks();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Trust Proxy (for apps behind load balancer)
    // ═══════════════════════════════════════════════════════════════════════
    if (options.trustProxy) {
      const httpAdapter = app.getHttpAdapter();
      const instance = httpAdapter.getInstance();
      if (instance?.set) {
        instance.set('trust proxy', options.trustProxy === true ? 1 : options.trustProxy);
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Body Size Limit
    // ═══════════════════════════════════════════════════════════════════════
    if (options.bodyLimit) {
      const express = require('express');
      app.use(express.json({ limit: options.bodyLimit }));
      app.use(express.urlencoded({ extended: true, limit: options.bodyLimit }));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Request ID Middleware
    // ═══════════════════════════════════════════════════════════════════════
    if (options.requestId !== false) {
      const { RequestIdMiddleware } = await import('./middleware');
      const middleware = new RequestIdMiddleware();
      app.use(middleware.use.bind(middleware));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Correlation ID Middleware
    // ═══════════════════════════════════════════════════════════════════════
    if (options.correlationId !== false) {
      const { CorrelationIdMiddleware } = await import('./middleware');
      const middleware = new CorrelationIdMiddleware();
      app.use(middleware.use.bind(middleware));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Global Interceptors
    // ═══════════════════════════════════════════════════════════════════════
    const interceptors: any[] = [];

    if (options.requestLogging !== false) {
      try {
        // Destructure both the interceptor and the LoggerManager token so we
        // can resolve the manager from the DI container and satisfy the
        // interceptor's required constructor argument.
        const { RequestLoggingInterceptor, LoggerManager } = await import('@stackra/logger/nestjs');
        interceptors.push(new RequestLoggingInterceptor(app.get(LoggerManager)));
      } catch {
        // @stackra/logger not installed — skip request logging
      }
    }

    if (options.timeout && options.timeout > 0) {
      const { TimeoutInterceptor } = await import('./interceptors');
      interceptors.push(new TimeoutInterceptor(options.timeout));
    }

    // NOTE: The optional `@stackra/nestjs-response` envelope integration was
    // removed because the package does not exist in this workspace and the
    // dynamic import broke downstream typechecks (TS2307). The `responseEnvelope`
    // option is preserved on the options interface and on the builder for API
    // stability; it is currently a no-op. If standard envelope wrapping is
    // needed, register `ApiResponseInterceptor` from `@stackra/swagger` directly
    // (it lives in the swagger package today), or reintroduce a dedicated
    // response package and wire it here.
    if (options.responseEnvelope) {
      Application.logger.warn(
        'responseEnvelope=true was requested, but no envelope interceptor is wired in this build. ' +
          'Register ApiResponseInterceptor from @stackra/swagger explicitly if you need it.'
      );
    }

    if (interceptors.length > 0) {
      app.useGlobalInterceptors(...interceptors);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Global Exception Filters
    // ═══════════════════════════════════════════════════════════════════════
    const { AllExceptionsFilter, ValidationExceptionFilter } = await import('./filters');
    const httpAdapterRef = app.getHttpAdapter();
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapterRef), new ValidationExceptionFilter());

    // ═══════════════════════════════════════════════════════════════════════
    // Global Pipes (additional)
    // ═══════════════════════════════════════════════════════════════════════
    const pipes: any[] = [];

    if (options.trimStrings !== false) {
      const { TrimPipe } = await import('./pipes');
      pipes.push(new TrimPipe());
    }

    if (options.stripHtml) {
      const { StripHtmlPipe } = await import('./pipes');
      pipes.push(new StripHtmlPipe());
    }

    if (pipes.length > 0) {
      app.useGlobalPipes(...pipes);
    }
  }

  /**
   * Start the application on the configured port.
   *
   * @param app - Configured NestJS application
   * @param options - Options containing port and host
   */
  private static async start(app: INestApplication, options: IApplicationOptions): Promise<void> {
    const port = options.port ?? Number(process.env.PORT ?? 3000);
    const host = options.host ?? '0.0.0.0';
    const name = options.name ?? process.env.APP_NAME ?? 'API';

    await app.listen(port, host);

    Application.logger.log(`🚀 ${name} running on http://${host}:${port}`);

    if (options.prefix) {
      Application.logger.log(`📡 REST API: http://localhost:${port}/${options.prefix}`);
    }
    if (options.swagger) {
      const swaggerPath =
        typeof options.swagger === 'object' ? (options.swagger.path ?? 'api/docs') : 'api/docs';
      Application.logger.log(`📚 Swagger: http://localhost:${port}/${swaggerPath}`);
    }
    Application.logger.log(`📊 GraphQL: http://localhost:${port}/graphql`);
    Application.logger.log(`❤️  Health: http://localhost:${port}/health`);
  }

  /**
   * Run the application in CLI mode (headless command execution).
   *
   * Boots NestJS without HTTP, discovers @Command() providers,
   * parses process.argv, dispatches the matched command, and exits.
   *
   * @param module - The root NestJS module class
   * @param options - CLI options
   *
   * @example
   * ```typescript
   * // cli.ts
   * import { Application } from '@stackra/container/nestjs';
   * import { AppModule } from './app.module';
   *
   * Application.cli(AppModule);
   * ```
   */
  public static async cli(module: Type<any>, options?: ICliOptions): Promise<never> {
    const { ConsoleKernel } = await import('@stackra/console');
    return ConsoleKernel.run(module, options);
  }

  /**
   * Run the application in Worker mode (long-running queue consumer).
   *
   * Boots NestJS without HTTP. BullMQ @Processor() classes auto-start
   * via NestJS lifecycle hooks. The process stays alive consuming jobs.
   *
   * @param module - The root NestJS module class
   * @param options - Worker options
   * @returns The running application context
   *
   * @example
   * ```typescript
   * // worker.ts
   * import { Application } from '@stackra/container/nestjs';
   * import { AppModule } from './app.module';
   *
   * Application.worker(AppModule, { queues: ['emails', 'notifications'] });
   * ```
   */
  public static async worker(
    module: Type<any>,
    options?: IWorkerOptions
  ): Promise<INestApplicationContext> {
    const logLevels = options?.logLevels ?? ['error', 'warn', 'log'];

    const app = await NestFactory.createApplicationContext(module, {
      logger: logLevels as any,
    });

    app.enableShutdownHooks();
    Application.setupShutdown(app, options?.shutdownTimeout ?? 10_000);

    const queuesInfo = options?.queues?.length ? options.queues.join(', ') : 'all';
    Application.logger.log(`🔄 Worker running (queues: ${queuesInfo})`);

    return app;
  }

  /**
   * Run the application in Microservice mode.
   *
   * Supports two patterns:
   * - **Standalone**: Pure microservice (no HTTP) — listens on transport only
   * - **Hybrid**: HTTP server + microservice transport listeners simultaneously
   *
   * Multiple transports can be connected at once (e.g., TCP + Redis + Kafka).
   *
   * @param module - The root NestJS module class
   * @param options - Microservice configuration (transport, hybrid mode, etc.)
   * @returns The running application (INestApplication in hybrid, INestMicroservice in standalone)
   *
   * @example Standalone TCP microservice:
   * ```typescript
   * await Application.microservice(AppModule, {
   *   connections: { transport: 'tcp', options: { host: '0.0.0.0', port: 4000 } },
   * });
   * ```
   *
   * @example Hybrid (HTTP + Redis):
   * ```typescript
   * await Application.microservice(AppModule, {
   *   hybrid: true,
   *   httpOptions: { port: 3000, prefix: 'api' },
   *   connections: { transport: 'redis', options: { host: 'localhost', port: 6379 } },
   * });
   * ```
   *
   * @example Multiple transports:
   * ```typescript
   * await Application.microservice(AppModule, {
   *   connections: [
   *     { transport: 'tcp', options: { port: 4000 } },
   *     { transport: 'redis', options: { host: 'localhost' } },
   *   ],
   * });
   * ```
   */
  public static async microservice(module: Type<any>, options: IMicroserviceOptions): Promise<any> {
    const logLevels = options.logLevels ?? ['error', 'warn', 'log'];
    const shutdownTimeout = options.shutdownTimeout ?? 10_000;

    // Lazy import @nestjs/microservices to avoid hard dep for non-microservice apps
    let Transport: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const microservicesPkg = require('@nestjs/microservices');
      Transport = microservicesPkg.Transport;
    } catch {
      throw new Error(
        '[Application.microservice] @nestjs/microservices is not installed. ' +
          'Install it with: yarn add @nestjs/microservices'
      );
    }

    const connections = Array.isArray(options.connections)
      ? options.connections
      : [options.connections];

    // ─── Transport name → NestJS Transport enum mapping ──────────────────
    const transportMap: Record<string, number> = {
      tcp: Transport.TCP,
      redis: Transport.REDIS,
      nats: Transport.NATS,
      mqtt: Transport.MQTT,
      grpc: Transport.GRPC,
      kafka: Transport.KAFKA,
      rmq: Transport.RMQ,
    };

    if (options.hybrid) {
      // ─── Hybrid Mode: HTTP + Microservice transports ───────────────────
      const app = await NestFactory.create(module, {
        bufferLogs: true,
        logger: logLevels as any,
      });

      // Apply HTTP configuration
      if (options.httpOptions) {
        await Application.configure(app, options.httpOptions);
      }

      // Connect microservice transports
      for (const conn of connections) {
        const transport = transportMap[conn.transport];
        if (transport === undefined) {
          throw new Error(`[Application.microservice] Unknown transport: "${conn.transport}"`);
        }
        app.connectMicroservice({ transport, options: conn.options ?? {} });
      }

      // Start all microservices + HTTP
      await app.startAllMicroservices();
      await Application.start(app, options.httpOptions ?? {});

      app.enableShutdownHooks();
      Application.setupShutdown(app, shutdownTimeout);

      const transports = connections.map((c) => c.transport).join(', ');
      Application.logger.log(`🌐 Hybrid app running (HTTP + ${transports})`);

      return app;
    } else {
      // ─── Standalone Microservice (no HTTP) ─────────────────────────────
      if (connections.length === 1) {
        // Single transport — use createMicroservice
        const conn = connections[0]!;
        const transport = transportMap[conn.transport];
        if (transport === undefined) {
          throw new Error(`[Application.microservice] Unknown transport: "${conn.transport}"`);
        }

        const app = await NestFactory.createMicroservice(module, {
          transport,
          options: conn.options ?? {},
          logger: logLevels as any,
        } as any);

        app.enableShutdownHooks();
        await app.listen();

        Application.logger.log(`📡 Microservice listening (${conn.transport})`);
        return app;
      } else {
        // Multiple transports — use hybrid approach without HTTP
        const app = await NestFactory.create(module, {
          bufferLogs: true,
          logger: logLevels as any,
        });

        for (const conn of connections) {
          const transport = transportMap[conn.transport];
          if (transport === undefined) {
            throw new Error(`[Application.microservice] Unknown transport: "${conn.transport}"`);
          }
          app.connectMicroservice({ transport, options: conn.options ?? {} });
        }

        await app.startAllMicroservices();
        app.enableShutdownHooks();
        Application.setupShutdown(app, shutdownTimeout);

        const transports = connections.map((c) => c.transport).join(', ');
        Application.logger.log(`📡 Microservice listening (${transports})`);

        return app;
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Private Helpers
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Setup graceful shutdown with timeout.
   */
  private static setupShutdown(app: any, timeoutMs: number): void {
    const shutdown = async (): Promise<void> => {
      Application.logger.log('Shutting down gracefully...');
      setTimeout(() => {
        Application.logger.warn(`Shutdown timeout (${timeoutMs}ms) — forcing exit.`);
        process.exit(1);
      }, timeoutMs).unref();

      await app.close();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  }
}
