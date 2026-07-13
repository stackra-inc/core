/**
 * @file create-fetch-handler.ts
 * @module @stackra/ssr/core/server/handlers
 * @description Adapter that produces a Web-fetch handler from an application.
 *
 *   Works on Bun, Deno, Cloudflare Workers, and any runtime whose HTTP
 *   entry expects `(request: Request) => Promise<Response>`.
 */

import type { IApplication } from '@stackra/contracts';
import { renderRequest } from './render-request';

/**
 * Return a Web-fetch handler bound to the supplied application.
 *
 * @example
 * ```typescript
 * // main.server.ts
 * const app = await ApplicationFactory.create(AppModule);
 * const handler = createFetchHandler(app);
 * export default { fetch: handler }; // Bun / Workers
 * ```
 */
export function createFetchHandler(app: IApplication): (request: Request) => Promise<Response> {
  return (request) => renderRequest(request, app);
}
