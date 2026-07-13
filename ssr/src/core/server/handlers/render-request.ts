/**
 * @file render-request.ts
 * @module @stackra/ssr/core/server/handlers
 * @description Free-function convenience wrapper around `SsrRenderer`.
 *
 *   Most consumers don't need this — they inject `SSR_RENDERER` from
 *   the container. It exists for cases where the caller has an
 *   application context in scope but doesn't want to plumb a service
 *   reference through their own code (Vite dev-server middleware being
 *   the typical example).
 */

import type { IApplication } from '@stackra/contracts';
import { SSR_RENDERER } from '@stackra/contracts';

import { SsrRenderer } from '../services/ssr-renderer.service';

/**
 * Render a request via the application's `SSR_RENDERER`.
 *
 * The application must have imported `SsrModule.forRoot({...})` before
 * calling this — otherwise the token resolves to nothing and the call
 * throws.
 */
export function renderRequest(request: Request, app: IApplication): Promise<Response> {
  const renderer = app.get(SSR_RENDERER) as SsrRenderer;
  return renderer.render(request);
}
