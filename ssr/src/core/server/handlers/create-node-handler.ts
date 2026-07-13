/**
 * @file create-node-handler.ts
 * @module @stackra/ssr/core/server/handlers
 * @description Adapter that produces a Node `http`/`https`-compatible
 *   handler from an application.
 *
 *   Bridges Node's `IncomingMessage` / `ServerResponse` primitives to
 *   the renderer's Web `Request` / `Response` API via
 *   `nodeReqToWebRequest` and `pipeResponseToNode`.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import type { IApplication } from '@stackra/contracts';

import { nodeReqToWebRequest, pipeResponseToNode } from '../utils/node-req-adapter.util';
import { renderRequest } from './render-request';

/**
 * Return a Node HTTP handler bound to the supplied application.
 *
 * @example
 * ```typescript
 * // server.node.ts
 * import { createServer } from 'node:http';
 * import { ApplicationFactory } from '@stackra/container';
 * import { createNodeHandler } from '@stackra/ssr/server';
 * import { AppModule } from './app.module';
 *
 * const app = await ApplicationFactory.create(AppModule);
 * const handler = createNodeHandler(app);
 * createServer((req, res) => handler(req, res).catch((err) => {
 *   console.error(err);
 *   res.statusCode = 500;
 *   res.end('Internal Server Error');
 * })).listen(3000);
 * ```
 */
export function createNodeHandler(
  app: IApplication
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  return async (req, res) => {
    const request = nodeReqToWebRequest(req);
    const response = await renderRequest(request, app);
    await pipeResponseToNode(response, res);
  };
}
