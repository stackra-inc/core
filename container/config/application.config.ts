/**
 * Application Configuration
 *
 * NestJS application bootstrap options for `Application.create()`.
 * Uses the options interface for type-safe configuration with full IDE autocomplete.
 *
 * This file is the single place to configure:
 * - Server (port, host, prefix)
 * - Security (helmet, CORS, cookie parser, trust proxy)
 * - Performance (compression)
 * - Validation (global ValidationPipe)
 * - API documentation (Swagger/OpenAPI)
 * - Graceful shutdown behavior
 *
 * ## Usage
 *
 * ```typescript
 * // main.ts
 * * import { Application } from '@stackra/container/nestjs';
 * import applicationConfig from './config/application.config';
 * import { AppModule } from './app.module';
 *
 * await Application.create(AppModule, applicationConfig);
 * ```
 *
 * ## Environment Variables
 *
 * | Variable          | Description                                  | Default          |
 * |-------------------|----------------------------------------------|------------------|
 * | `APP_NAME`        | Application name (shown in logs)             | `'Academorix API'`  |
 * | `PORT`            | Server port                                  | `3000`           |
 * | `HOST`            | Server bind address                          | `'0.0.0.0'`      |
 * | `NODE_ENV`        | Environment (disables swagger in production) | `'development'`  |
 * | `TRUST_PROXY`     | Trust X-Forwarded-* headers                  | `'false'`        |
 * | `CORS_ORIGIN`     | Allowed CORS origins (comma-separated)       | `'*'` (all)      |
 *
 * @module config/application
 */

import { defineConfig } from '@stackra/container';
import type { IApplicationOptions } from '@stackra/contracts';

/**
 * NestJS application bootstrap configuration.
 *
 * Passed directly to `Application.create(AppModule, applicationConfig)`.
 * All fields have sensible production defaults — override only what you need.
 */
export const applicationConfig = defineConfig<IApplicationOptions>({
  /*
  |--------------------------------------------------------------------------
  | Application Identity
  |--------------------------------------------------------------------------
  |
  | The application name appears in startup logs, health check responses,
  | and error reports. The port and host determine where the server binds.
  |
  */
  name: process.env.APP_NAME ?? 'Academorix API',
  port: Number(process.env.PORT ?? 3000),
  host: process.env.HOST ?? '0.0.0.0',

  /*
  |--------------------------------------------------------------------------
  | Global Route Prefix
  |--------------------------------------------------------------------------
  |
  | All REST controllers are prefixed with this path. Set to empty string
  | to disable. Routes in `prefixExclude` bypass the prefix entirely
  | (health checks, GraphQL, metrics should be at root).
  |
  */
  prefix: 'api',
  prefixExclude: ['health', 'graphql', 'metrics', 'ready', 'live'],

  /*
  |--------------------------------------------------------------------------
  | Security — Helmet
  |--------------------------------------------------------------------------
  |
  | Helmet sets various HTTP headers to help protect your app from
  | well-known web vulnerabilities. Enabled by default. Pass an object
  | to customize individual headers, or `false` to disable.
  |
  | Requires: `yarn add helmet`
  |
  */
  helmet: true,

  /*
  |--------------------------------------------------------------------------
  | Security — CORS
  |--------------------------------------------------------------------------
  |
  | Cross-Origin Resource Sharing configuration lives in its own config file.
  | See: config/cors.config.ts
  |
  | Import and pass as the `cors` option, or set `true` for built-in defaults.
  |
  */
  cors: true, // Or: import corsConfig from './cors.config'; cors: corsConfig,

  /*
  |--------------------------------------------------------------------------
  | Security — Cookie Parser
  |--------------------------------------------------------------------------
  |
  | Enables parsing of signed and unsigned cookies from request headers.
  | Set `cookieSecret` for signed cookie support.
  |
  | Requires: `yarn add cookie-parser`
  |
  */
  cookieParser: true,
  cookieSecret: process.env.COOKIE_SECRET,

  /*
  |--------------------------------------------------------------------------
  | Security — Trust Proxy
  |--------------------------------------------------------------------------
  |
  | Enable when running behind a load balancer or reverse proxy (nginx,
  | AWS ALB, CloudFlare). This trusts X-Forwarded-* headers for accurate
  | client IP resolution in rate limiting and logging.
  |
  | Set to `true` for one proxy hop, or a number for specific depth.
  |
  */
  trustProxy: process.env.TRUST_PROXY === 'true',

  /*
  |--------------------------------------------------------------------------
  | Performance — Compression
  |--------------------------------------------------------------------------
  |
  | Enables gzip/brotli response compression. Reduces payload size by
  | 60-80% for JSON responses. Disable if your reverse proxy handles
  | compression (e.g., nginx, CloudFlare).
  |
  | Requires: `yarn add compression`
  |
  */
  compression: true,

  /*
  |--------------------------------------------------------------------------
  | Validation — Global ValidationPipe
  |--------------------------------------------------------------------------
  |
  | Automatically validates and transforms all incoming request bodies
  | using class-validator decorators on DTOs.
  |
  | - `transform`: Auto-convert payloads to DTO class instances
  | - `whitelist`: Strip unknown properties not in the DTO
  | - `forbidNonWhitelisted`: Reject requests with unknown fields (400)
  |
  | Requires: `yarn add class-validator class-transformer`
  |
  */
  validation: {
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true },
  },

  /*
  |--------------------------------------------------------------------------
  | API Documentation — Swagger / OpenAPI
  |--------------------------------------------------------------------------
  |
  | Swagger configuration lives in its own package: @stackra/nestjs-swagger
  | See: packages/infra/swagger/config/swagger.config.ts
  |
  | The swagger package has its own module (NestSwaggerModule.forRoot())
  | registered separately in app.module.ts. No config needed here.
  |
  */

  /*
  |--------------------------------------------------------------------------
  | Graceful Shutdown
  |--------------------------------------------------------------------------
  |
  | When the process receives SIGTERM/SIGINT, NestJS will:
  | 1. Stop accepting new connections
  | 2. Wait for in-flight requests to complete (up to `timeout` ms)
  | 3. Call `onApplicationShutdown()` on all providers
  | 4. Close the process
  |
  | Essential for zero-downtime deployments (Kubernetes, ECS, etc.).
  |
  */
  shutdown: {
    graceful: true,
    timeout: 10_000,
  },
});
