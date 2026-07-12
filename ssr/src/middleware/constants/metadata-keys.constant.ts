/**
 * @file metadata-keys.constant.ts
 * @module @stackra/ssr/middleware/constants
 * @description Reflect-metadata keys used by the middleware runtime.
 */

/**
 * Metadata key that attaches a `MiddlewareOptions` payload to a middleware
 * class. Used by `defineMiddleware` when the class-form overload is invoked
 * so that the resolver and registry can introspect metadata without
 * instantiating the class.
 */
export const MIDDLEWARE_METADATA_KEY = 'stackra:middleware:metadata';

/**
 * DI token that identifies the eager-bootstrap provider registered by
 * `MiddlewareModule.forRoot(...)`. Resolving this token forces the
 * container to materialize the provider (and therefore populate the
 * registry) at application startup rather than lazily.
 */
export const MIDDLEWARE_BOOTSTRAP = Symbol.for('MIDDLEWARE_BOOTSTRAP');
