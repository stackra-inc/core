/**
 * @file stackra-ssr.plugin.ts
 * @module @stackra/ssr/vite/plugins
 * @description The Vite plugin that wires SSR into the dev server.
 *
 *   Responsibilities:
 *     1. Register a dev-server middleware that intercepts HTML requests
 *        and delegates to `renderRequest`.
 *     2. Expose `virtual:stackra/routes` and `virtual:stackra/middleware`
 *        virtual modules so the client bundle can `import { routes }`
 *        without knowing the file path.
 *     3. Keep every SSR module load fresh via `server.ssrLoadModule` —
 *        no bootstrap caching, so route/middleware edits reflect on the
 *        next request without a restart.
 *
 *   Production bundles are out of scope for v0.2 — consumers wire the
 *   adapter (`createNodeHandler` / `createFetchHandler`) into their
 *   preferred server themselves.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin, ViteDevServer } from 'vite';

import type { StackraSsrOptions } from '../interfaces/stackra-ssr-options.interface';
import { isHtmlRequest } from '../utils/is-html-request.util';
import {
  EMPTY_MIDDLEWARE_SOURCE,
  reExportFrom,
  resolvedId,
  VIRTUAL_MIDDLEWARE_ID,
  VIRTUAL_ROUTES_ID,
} from '../utils/virtual-modules.util';

/**
 * Handler shape produced by the consumer's `ssrEntry` module.
 *
 * The module should default-export an async factory that returns
 * `{ handler }` — the plugin calls it per request.
 */
interface SsrEntryModule {
  default: () => Promise<{
    handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
  }>;
}

/**
 * Create the `stackraSsr` Vite plugin.
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import { stackraSsr } from '@stackra/ssr/vite';
 *
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *     stackraSsr({
 *       ssrEntry: '/src/entry.server.ts',
 *       routesFile: '/src/routes.ts',
 *       middlewareFile: '/src/config/middleware.config.ts',
 *     }),
 *   ],
 * });
 * ```
 */
export function stackraSsr(options: StackraSsrOptions): Plugin {
  const {
    ssrEntry,
    routesFile,
    middlewareFile,
    shouldRender = () => true,
    exposeErrors = true,
  } = options;

  const resolvedRoutesId = resolvedId(VIRTUAL_ROUTES_ID);
  const resolvedMiddlewareId = resolvedId(VIRTUAL_MIDDLEWARE_ID);

  return {
    name: 'stackra:ssr',
    enforce: 'pre',

    resolveId(id: string) {
      if (id === VIRTUAL_ROUTES_ID) return resolvedRoutesId;
      if (id === VIRTUAL_MIDDLEWARE_ID) return resolvedMiddlewareId;
      return null;
    },

    load(id: string) {
      if (id === resolvedRoutesId) {
        return routesFile ? reExportFrom(routesFile) : `export const routes = [];\n`;
      }
      if (id === resolvedMiddlewareId) {
        return middlewareFile ? reExportFrom(middlewareFile) : EMPTY_MIDDLEWARE_SOURCE;
      }
      return null;
    },

    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          try {
            if (!isHtmlRequest(req) || !shouldRender(req)) {
              return next();
            }

            // Load the SSR entry fresh — reflects latest edits without restart.
            const mod = (await server.ssrLoadModule(ssrEntry)) as unknown as SsrEntryModule;
            const { handler } = await mod.default();
            await handler(req, res);
          } catch (err) {
            // Let Vite render its overlay when we expose errors.
            if (exposeErrors) {
              server.ssrFixStacktrace(err as Error);
              next(err);
              return;
            }
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        });
      };
    },
  };
}
