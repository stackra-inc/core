/**
 * @file stackra-api-route.type.ts
 * @module @stackra/ssr/react/types
 * @description Shape of a JSON API route entry declared via `defineApiRoute`.
 */

import type { HttpContext, MiddlewareDefinition, MiddlewareTuple } from '../../core/middleware';

/**
 * HTTP verbs accepted by API routes.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

/**
 * Handler signature for API routes.
 *
 * Receives the same `HttpContext` as HTTP-stage middleware. Return values
 * are normalised by the server runtime:
 *
 * - `Response`         → returned verbatim.
 * - `object` / `array` → JSON-serialised, `content-type: application/json`.
 * - `string`           → wrapped in a plain-text `Response`.
 * - `Promise<T>`       → awaited then normalised recursively.
 * - Thrown signal      → mapped by `signalToResponse` (redirect/notFound/abort).
 */
export type StackraApiHandler = (
  ctx: HttpContext
) => Response | object | string | Promise<Response | object | string>;

/**
 * Declarative API route entry accepted by `defineApiRoute(...)`.
 */
export interface StackraApiRoute {
  /**
   * URL pattern (matched against `request.url` at request time).
   *
   * Supports path parameters in the form `/users/:id`. Params are
   * available on `ctx.params` inside the handler.
   */
  readonly path: string;
  /** HTTP verb. Defaults to `'GET'` if omitted. */
  readonly method?: HttpMethod;
  /**
   * Middleware chain applied before the handler runs. Same union as
   * `StackraRoute.middleware`.
   */
  readonly middleware?: readonly (MiddlewareDefinition | string | MiddlewareTuple)[];
  /** Route handler function. */
  readonly handler: StackraApiHandler;
  /** Free-form metadata — surfaced in dev tools; ignored by the runtime. */
  readonly meta?: Readonly<Record<string, unknown>>;
}
