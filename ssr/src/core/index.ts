/**
 * @file index.ts
 * @module @stackra/ssr
 * @description Root barrel — the primary import surface.
 *
 *   Re-exports the middleware, server, and SEO subsystems plus the
 *   composite `SsrModule`. Framework-specific subpaths (`./react`,
 *   `./vite`, `./testing`) ship through their own entries.
 *
 *   Both the middleware and server subsystems declare `defineConfig` /
 *   `mergeConfig` for their own option shapes. To avoid an ambiguous
 *   root export, the server variants are re-exported as
 *   `defineSsrConfig` / `mergeSsrConfig`.
 */

// ═══════════════════════════════════════════════════════════════════════
// Composite module
// ═══════════════════════════════════════════════════════════════════════
export { SsrModule, type SsrRootOptions } from './ssr.module';

// ═══════════════════════════════════════════════════════════════════════
// Middleware subsystem (defineMiddleware, signals, decorators, ...)
// ═══════════════════════════════════════════════════════════════════════
export * from './middleware';

// ═══════════════════════════════════════════════════════════════════════
// Server subsystem (routing + renderer + decorators)
// ═══════════════════════════════════════════════════════════════════════
export {
  ServerModule,
  RouteRegistry,
  ApiRouteRegistry,
  RouteDiscovery,
  SsrRenderer,
  Route,
  ApiRoute,
  renderRequest,
  createFetchHandler,
  createNodeHandler,
  CRAWLER_PATTERN,
  isCrawler,
  signalToResponse,
  errorToResponse,
  nodeReqToWebRequest,
  pipeResponseToNode,
  matchApiRoute,
  defineConfig as defineSsrConfig,
  mergeConfig as mergeSsrConfig,
  DEFAULT_SSR_CONFIG,
} from './server';
export type {
  ApiRouteMatch,
  SsrModuleOptions,
  RouteDescriptor,
  RouteSource,
  ApiRouteDescriptor,
  RouteMetadata,
  ApiRouteMetadata,
} from './server';

// ═══════════════════════════════════════════════════════════════════════
// SEO / AEO subsystem
// ═══════════════════════════════════════════════════════════════════════
export * from './seo';
