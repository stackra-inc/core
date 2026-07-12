/**
 * @file application-options.interface.ts
 * @module @stackra/container/src/interfaces
 * @description IApplicationOptions interface.
 */

/** CORS configuration options. */
export interface ICorsOptions {
  /** Allowed origin(s). */
  origin?:
    | boolean
    | string
    | string[]
    | RegExp
    | ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void);
  /** Allowed HTTP methods. */
  methods?: string | string[];
  /** Allowed headers. */
  allowedHeaders?: string | string[];
  /** Exposed headers. */
  exposedHeaders?: string | string[];
  /** Whether to include credentials. */
  credentials?: boolean;
  /** Preflight cache duration in seconds. */
  maxAge?: number;
  /** Whether to pass the CORS preflight response to the next handler. */
  preflightContinue?: boolean;
  /** Success status code for OPTIONS requests. */
  optionsSuccessStatus?: number;
}

/** Validation pipe options. */
export interface IValidationOptions {
  /** Transform payloads to DTO instances. */
  transform?: boolean;
  /** Strip properties not in DTO. */
  whitelist?: boolean;
  /** Reject requests with unknown properties. */
  forbidNonWhitelisted?: boolean;
  /** Enable implicit type conversion. */
  transformOptions?: { enableImplicitConversion?: boolean };
  /** Stop at first validation error. */
  stopAtFirstError?: boolean;
  /** Disable detailed error messages. */
  disableErrorMessages?: boolean;
}

/** Swagger/OpenAPI configuration. */
export interface ISwaggerOptions {
  /** API title. */
  title?: string;
  /** API description. */
  description?: string;
  /** API version. */
  version?: string;
  /** Path to mount Swagger UI. Default: 'api/docs'. */
  path?: string;
  /** Whether to enable Swagger in this environment. */
  enabled?: boolean;
}

/** Graceful shutdown configuration. */
export interface IShutdownOptions {
  /** Enable graceful shutdown. Default: true. */
  graceful?: boolean;
  /** Timeout in milliseconds before forcing exit. Default: 10000. */
  timeout?: number;
  /** Callback invoked during shutdown (e.g., to flush buffers). */
  onShutdown?: () => Promise<void>;
}

/** API versioning configuration. */
export interface IVersioningOptions {
  /** Versioning type. */
  type?: 'uri' | 'header' | 'media-type' | 'custom';
  /** Default version if none specified by client. */
  defaultVersion?: string | string[];
  /** Header name for header-based versioning. */
  header?: string;
  /** URI prefix for URI-based versioning. */
  prefix?: string;
}

/**
 * Full configuration for the Application bootstrap.
 *
 * All options have sensible defaults. Pass only what you want to override.
 * Set an option to `false` to explicitly disable it.
 */
export interface IApplicationOptions {
  // ══════════════════════════════════════════════════════════════════════════
  // General
  // ══════════════════════════════════════════════════════════════════════════

  /** Application name (shown in logs). Default: process.env.APP_NAME ?? 'API'. */
  name?: string;

  /** Port to listen on. Default: process.env.PORT ?? 3000. */
  port?: number;

  /** Host to bind to. Default: '0.0.0.0'. */
  host?: string;

  /** Whether to abort process on unhandled errors during bootstrap. Default: false. */
  abortOnError?: boolean;

  // ══════════════════════════════════════════════════════════════════════════
  // API Configuration
  // ══════════════════════════════════════════════════════════════════════════

  /** Global route prefix (e.g., 'api', 'api/v1'). */
  prefix?: string;

  /** Routes excluded from the global prefix. Default: ['health', 'graphql', 'metrics', 'ready', 'live']. */
  prefixExclude?: string[];

  // ══════════════════════════════════════════════════════════════════════════
  // Security
  // ══════════════════════════════════════════════════════════════════════════

  /** Enable helmet security headers. Pass object for custom config. Default: true. */
  helmet?: boolean | Record<string, unknown>;

  /** CORS configuration. Pass object for custom config, true for defaults, false to disable. Default: true. */
  cors?: boolean | ICorsOptions;

  /** Cookie parser secret (for signed cookies). */
  cookieSecret?: string;

  /** Enable cookie parser. Default: true. */
  cookieParser?: boolean;

  /** Trust proxy setting (for apps behind load balancer/reverse proxy). */
  trustProxy?: boolean | number | string;

  // ══════════════════════════════════════════════════════════════════════════
  // Performance
  // ══════════════════════════════════════════════════════════════════════════

  /** Enable response compression. Pass object for custom config. Default: true. */
  compression?: boolean | Record<string, unknown>;

  // ══════════════════════════════════════════════════════════════════════════
  // Validation
  // ══════════════════════════════════════════════════════════════════════════

  /** Enable global ValidationPipe. Pass object for custom config. Default: true. */
  validation?: boolean | IValidationOptions;

  // ══════════════════════════════════════════════════════════════════════════
  // Swagger / API Docs
  // ══════════════════════════════════════════════════════════════════════════

  /** Swagger/OpenAPI configuration. false to disable. */
  swagger?: false | ISwaggerOptions;

  // ══════════════════════════════════════════════════════════════════════════
  // Shutdown
  // ══════════════════════════════════════════════════════════════════════════

  /** Graceful shutdown configuration. */
  shutdown?: IShutdownOptions;

  // ══════════════════════════════════════════════════════════════════════════
  // Body Parsing
  // ══════════════════════════════════════════════════════════════════════════

  /** Maximum request body size (e.g., '10mb', '1mb'). Default: '10mb'. */
  bodyLimit?: string;

  /** Enable raw body preservation for webhook signature verification. Default: false. */
  rawBody?: boolean | string[];

  // ══════════════════════════════════════════════════════════════════════════
  // Request Tracing
  // ══════════════════════════════════════════════════════════════════════════

  /** Enable X-Request-ID generation/propagation. Default: true. */
  requestId?: boolean;

  /** Enable X-Correlation-ID propagation. Default: true. */
  correlationId?: boolean;

  // ══════════════════════════════════════════════════════════════════════════
  // Timeout
  // ══════════════════════════════════════════════════════════════════════════

  /** Global request timeout in milliseconds. 0 = disabled. Default: 30000. */
  timeout?: number;

  // ══════════════════════════════════════════════════════════════════════════
  // Response
  // ══════════════════════════════════════════════════════════════════════════

  /** Wrap all responses in standard envelope { data, statusCode, timestamp, path }. Default: false. */
  responseEnvelope?: boolean;

  // ══════════════════════════════════════════════════════════════════════════
  // Logging
  // ══════════════════════════════════════════════════════════════════════════

  /** Enable structured HTTP request logging. Default: true. */
  requestLogging?: boolean;

  // ══════════════════════════════════════════════════════════════════════════
  // Input Sanitization
  // ══════════════════════════════════════════════════════════════════════════

  /** Trim whitespace from all string inputs. Default: true. */
  trimStrings?: boolean;

  /** Strip HTML tags from string inputs (XSS prevention). Default: false. */
  stripHtml?: boolean;

  // ══════════════════════════════════════════════════════════════════════════
  // Versioning
  // ══════════════════════════════════════════════════════════════════════════

  /** API versioning configuration. */
  versioning?: IVersioningOptions;
}
