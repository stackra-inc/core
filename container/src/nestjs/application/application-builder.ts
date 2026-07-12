/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file application-builder.ts
 * @module @stackra/container/nestjs
 * @description Fluent builder for configuring and starting a NestJS application.
 *   Provides a chainable `.with*()` API for enabling production concerns.
 */
import { Type } from '@nestjs/common';
import type {
  IApplicationOptions,
  ICorsOptions,
  IValidationOptions,
  IShutdownOptions,
} from './application-options.interface';

/**
 * Fluent application builder.
 *
 * Constructs application options via chainable method calls, then starts
 * the server. Each `.with*()` enables a production concern. Call `.start()`
 * to create and boot the application.
 *
 * @example
 * ```typescript
 * import { Application } from '@stackra/container/nestjs';
 *
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
export class ApplicationBuilder {
  private readonly options: IApplicationOptions = {};

  /**
   * @param module - The root NestJS module class
   */
  public constructor(private readonly module: Type<any>) {}

  // ══════════════════════════════════════════════════════════════════════════
  // Identity
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Set the application name (shown in startup logs).
   *
   * @param name - Application display name
   * @returns this (chainable)
   */
  public withName(name: string): this {
    this.options.name = name;
    return this;
  }

  /**
   * Set the server port.
   *
   * @param port - Port number to listen on
   * @returns this (chainable)
   */
  public withPort(port: number): this {
    this.options.port = port;
    return this;
  }

  /**
   * Set the server host.
   *
   * @param host - Host address to bind to
   * @returns this (chainable)
   */
  public withHost(host: string): this {
    this.options.host = host;
    return this;
  }

  /**
   * Set the global route prefix.
   *
   * @param prefix - Route prefix (e.g., 'api', 'api/v1')
   * @param options - Optional exclusions for specific paths
   * @returns this (chainable)
   */
  public withPrefix(prefix: string, options?: { exclude?: string[] }): this {
    this.options.prefix = prefix;
    if (options?.exclude) this.options.prefixExclude = options.exclude;
    return this;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Security
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Enable Helmet security headers.
   *
   * @param config - Optional Helmet configuration
   * @returns this (chainable)
   */
  public withHelmet(config?: Record<string, unknown>): this {
    this.options.helmet = config ?? true;
    return this;
  }

  /**
   * Enable CORS.
   *
   * @param config - Optional CORS configuration (defaults to permissive dev config)
   * @returns this (chainable)
   */
  public withCors(config?: ICorsOptions): this {
    this.options.cors = config ?? true;
    return this;
  }

  /**
   * Enable cookie parser.
   *
   * @param secret - Optional secret for signed cookies
   * @returns this (chainable)
   */
  public withCookieParser(secret?: string): this {
    this.options.cookieParser = true;
    if (secret) this.options.cookieSecret = secret;
    return this;
  }

  /**
   * Enable trust proxy (for apps behind load balancer).
   *
   * @param value - Trust level (true = 1 hop, number = specific depth)
   * @returns this (chainable)
   */
  public withTrustProxy(value: boolean | number | string = true): this {
    this.options.trustProxy = value;
    return this;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Performance
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Enable response compression.
   *
   * @param config - Optional compression configuration
   * @returns this (chainable)
   */
  public withCompression(config?: Record<string, unknown>): this {
    this.options.compression = config ?? true;
    return this;
  }

  /**
   * Set max request body size.
   *
   * @param limit - Size limit (e.g., '10mb', '1mb', '500kb')
   * @returns this (chainable)
   */
  public withBodyLimit(limit: string): this {
    this.options.bodyLimit = limit;
    return this;
  }

  /**
   * Set global request timeout.
   *
   * @param ms - Timeout in milliseconds (0 = disabled)
   * @returns this (chainable)
   */
  public withTimeout(ms: number): this {
    this.options.timeout = ms;
    return this;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Observability
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Enable X-Request-ID generation and propagation.
   *
   * @returns this (chainable)
   */
  public withRequestId(): this {
    this.options.requestId = true;
    return this;
  }

  /**
   * Enable X-Correlation-ID propagation.
   *
   * @returns this (chainable)
   */
  public withCorrelationId(): this {
    this.options.correlationId = true;
    return this;
  }

  /**
   * Enable or disable structured HTTP request logging.
   *
   * Default behaviour is to enable when `@stackra/logger/nestjs` is
   * installed. Pass `false` to disable explicitly — useful when the
   * consumer registers their own `RequestLoggingInterceptor` via DI
   * (e.g. by importing `NestLoggerModule.forRoot()`).
   *
   * @param enabled - Whether to enable the interceptor (default `true`).
   * @returns this (chainable)
   */
  public withRequestLogging(enabled: boolean = true): this {
    this.options.requestLogging = enabled;
    return this;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Validation & Sanitization
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Enable global ValidationPipe.
   *
   * @param config - Optional validation options
   * @returns this (chainable)
   */
  public withValidation(config?: IValidationOptions): this {
    this.options.validation = config ?? true;
    return this;
  }

  /**
   * Enable automatic string trimming on all inputs.
   *
   * @returns this (chainable)
   */
  public withTrimStrings(): this {
    this.options.trimStrings = true;
    return this;
  }

  /**
   * Enable HTML stripping on all string inputs (XSS prevention).
   *
   * @returns this (chainable)
   */
  public withStripHtml(): this {
    this.options.stripHtml = true;
    return this;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Response
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Enable standard response envelope wrapping.
   *
   * @returns this (chainable)
   */
  public withResponseEnvelope(): this {
    this.options.responseEnvelope = true;
    return this;
  }

  /**
   * Enable raw body preservation for webhook signature verification.
   *
   * @returns this (chainable)
   */
  public withRawBody(): this {
    this.options.rawBody = true;
    return this;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Lifecycle
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Enable graceful shutdown with connection draining.
   *
   * @param config - Optional shutdown configuration (timeout, cleanup callback)
   * @returns this (chainable)
   */
  public withGracefulShutdown(config?: Partial<IShutdownOptions>): this {
    this.options.shutdown = { graceful: true, timeout: 10_000, ...config };
    return this;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Build & Start
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Get the compiled options object (without starting).
   *
   * @returns The accumulated application options
   */
  public build(): IApplicationOptions {
    return { ...this.options };
  }

  /**
   * Create, configure, and start the application.
   *
   * @returns The running NestJS application instance
   */
  public async start(): Promise<any> {
    const { Application } = await import('./application');
    return Application.create(this.module, this.options);
  }
}
