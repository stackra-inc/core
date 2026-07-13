/**
 * @file stackra-ssr-options.interface.ts
 * @module @stackra/ssr/vite/interfaces
 * @description Options accepted by the `stackraSsr(...)` Vite plugin.
 */

/**
 * Configuration for the Vite plugin.
 *
 * All fields are optional except `ssrEntry` — the plugin needs to know
 * which module exports `renderRequest` (and an application context) so
 * it can dispatch HTML requests through the SSR pipeline.
 */
export interface StackraSsrOptions {
  /**
   * Path to a module that default-exports an async function returning
   * `{ handler }` where `handler` is a Node-compatible request handler
   * — usually `createNodeHandler(app)`.
   *
   * The plugin `ssrLoadModule`s this file per request so hot reloads
   * work transparently.
   */
  readonly ssrEntry: string;

  /**
   * Path to the consumer's routes file — imported through the
   * `virtual:stackra/routes` module by the client bundle.
   */
  readonly routesFile?: string;

  /**
   * Path to the consumer's middleware config file — imported through
   * `virtual:stackra/middleware`. Optional; when omitted, the virtual
   * module exports an empty config.
   */
  readonly middlewareFile?: string;

  /**
   * Only intercept HTML requests when the User-Agent matches this
   * predicate. Defaults to always intercept (`() => true`).
   *
   * Consumers who want to run SSR only for crawlers pass
   * `(req) => isCrawler(req.headers['user-agent'])`.
   */
  readonly shouldRender?: (req: import('node:http').IncomingMessage) => boolean;

  /**
   * Whether to include error stacks in 500 responses. Defaults to
   * `true` in dev (Vite's plugin only runs in dev) — set to `false` to
   * force generic responses.
   */
  readonly exposeErrors?: boolean;
}
