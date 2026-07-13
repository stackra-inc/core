/**
 * @file ssr-module-options.interface.ts
 * @module @stackra/ssr/core/server/interfaces
 * @description Options payload accepted by `SsrModule.forRoot(...)`.
 */

import type { MiddlewareDefinition } from '../../middleware';
import type { StackraApiRoute, StackraRoute } from '../../../react/types';

/**
 * Configuration passed to `SsrModule.forRoot({...})`.
 *
 * All fields are optional — the module ships with sensible defaults via
 * `DEFAULT_SSR_CONFIG` (empty arrays, safe HTML fallbacks).
 */
export interface SsrModuleOptions {
  /**
   * Declarative UI route tree. Routes contributed here are merged with
   * routes discovered via `@Route()` decorators and any registered by
   * feature modules.
   */
  readonly routes?: readonly StackraRoute[];

  /**
   * Declarative API route table. Same merging semantics as `routes`.
   */
  readonly apiRoutes?: readonly StackraApiRoute[];

  /**
   * Global HTTP middleware evaluated before routing. Route-attached
   * middleware still runs inside the route's own chain.
   */
  readonly globalMiddleware?: readonly (MiddlewareDefinition | string)[];

  /**
   * Middleware group references applied globally (e.g. `['@web']`).
   */
  readonly globalGroups?: readonly `@${string}`[];

  /**
   * URL of the compiled client bundle — inlined as a `<script type="module">`
   * in the SPA shell path.
   */
  readonly clientEntry?: string;

  /**
   * Optional client CSS URL — inlined as `<link rel="stylesheet">` in
   * the SPA shell.
   */
  readonly clientCss?: string;

  /**
   * Custom crawler-detection predicate. Overrides the built-in
   * `isCrawler(userAgent)` when provided.
   */
  readonly isCrawler?: (userAgent: string | null) => boolean;

  /**
   * Force the crawler or human path regardless of User-Agent — used by
   * tests and by consumers who want to always SSR.
   */
  readonly force?: 'crawler' | 'human';

  /**
   * Include error messages in 500 responses. `true` in development,
   * defaults to `false` (returns generic `'Internal Server Error'`).
   */
  readonly exposeErrors?: boolean;

  /**
   * HTML shell template — override the default `<div id="app">` shell.
   * Receives `{ clientEntry, clientCss }` and returns HTML.
   */
  readonly renderShell?: (opts: { clientEntry?: string; clientCss?: string }) => string;
}
