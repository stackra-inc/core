/**
 * @file ssr.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the SSR + routing runtime shipped by `@stackra/ssr`.
 *
 *   Declared in contracts so cross-cutting consumers — dev tools,
 *   metrics collectors, feature modules — can resolve the SSR pieces
 *   without taking a direct dependency on `@stackra/ssr`.
 *
 *   @see `@stackra/ssr/core/server` for the runtime implementation.
 */

/**
 * Token for the `RouteRegistry` singleton — holds the UI route tree.
 */
export const ROUTE_REGISTRY = Symbol.for('ROUTE_REGISTRY');

/**
 * Token for the `ApiRouteRegistry` singleton — holds the API route table.
 */
export const API_ROUTE_REGISTRY = Symbol.for('API_ROUTE_REGISTRY');

/**
 * Token for the `SsrRenderer` service — orchestrates request → response.
 */
export const SSR_RENDERER = Symbol.for('SSR_RENDERER');

/**
 * Token for the merged SSR module configuration.
 *
 * Produced by `mergeConfig(DEFAULT_SSR_CONFIG, options)` inside
 * `SsrModule.forRoot(...)`. Consumers rarely inject this directly.
 */
export const SSR_CONFIG = Symbol.for('SSR_CONFIG');

/**
 * Metadata key attached to `@Route()`-decorated classes.
 */
export const ROUTE_METADATA_KEY = 'stackra:ssr:route';

/**
 * Metadata key attached to `@ApiRoute()`-decorated classes.
 */
export const API_ROUTE_METADATA_KEY = 'stackra:ssr:api-route';

/**
 * Token for the `SeoService` — merges route SEO descriptors and renders
 * `<head>` markup for the server path.
 */
export const SEO_SERVICE = Symbol.for('SEO_SERVICE');

/**
 * Token for the merged SEO configuration (site-wide defaults).
 */
export const SEO_CONFIG = Symbol.for('SEO_CONFIG');
