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
 * Metadata key attached by the `@Middleware()` class decorator. Marks a
 * class for auto-discovery + registration with `MiddlewareRegistry`.
 * Distinct from `MIDDLEWARE_METADATA_KEY` (which carries option metadata)
 * because a class can carry option metadata without opting into discovery.
 */
export const MIDDLEWARE_DISCOVERY_KEY = 'stackra:middleware:discover';
