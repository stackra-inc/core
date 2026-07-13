/**
 * @file index.ts
 * @module @stackra/ssr/server
 * @description Public API surface of the `@stackra/ssr/server` subpath.
 *
 *   The server subpath ships everything a Node / Bun / Deno / Worker
 *   runtime needs to render Stackra apps — the DI module, the renderer
 *   service, the HTTP adapters, and the helper utilities.
 */

// ═══════════════════════════════════════════════════════════════════════
// Module
// ═══════════════════════════════════════════════════════════════════════
export { ServerModule } from './server.module';

// ═══════════════════════════════════════════════════════════════════════
// Services
// ═══════════════════════════════════════════════════════════════════════
export { RouteRegistry, ApiRouteRegistry, RouteDiscovery, SsrRenderer } from './services';

// ═══════════════════════════════════════════════════════════════════════
// Decorators
// ═══════════════════════════════════════════════════════════════════════
export { Route, ApiRoute } from './decorators';

// ═══════════════════════════════════════════════════════════════════════
// Handlers
// ═══════════════════════════════════════════════════════════════════════
export { renderRequest, createFetchHandler, createNodeHandler } from './handlers';

// ═══════════════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════════════
export {
  CRAWLER_PATTERN,
  isCrawler,
  signalToResponse,
  errorToResponse,
  nodeReqToWebRequest,
  pipeResponseToNode,
  matchApiRoute,
  defineConfig,
  mergeConfig,
} from './utils';
export type { ApiRouteMatch } from './utils';

// ═══════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════
export { DEFAULT_SSR_CONFIG } from './constants';

// ═══════════════════════════════════════════════════════════════════════
// Interfaces (type-only exports)
// ═══════════════════════════════════════════════════════════════════════
export type {
  SsrModuleOptions,
  RouteDescriptor,
  RouteSource,
  ApiRouteDescriptor,
  RouteMetadata,
  ApiRouteMetadata,
} from './interfaces';
