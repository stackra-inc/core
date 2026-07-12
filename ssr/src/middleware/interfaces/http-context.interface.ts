/**
 * @file http-context.interface.ts
 * @module @stackra/ssr/middleware/interfaces
 * @description Context passed to `stage: 'http'` middleware — server-side only.
 */

import type { MiddlewareContextBase } from './middleware-context-base.interface';

/**
 * Server-side HTTP context. Populated by the SSR renderer or API adapter
 * before running the middleware chain.
 *
 * Uses the standard Web `Request` / `Response` types so it works across
 * every runtime (Node, Bun, Deno, Cloudflare Workers). Middleware can
 * either return a new `Response` (short-circuit) or mutate `state` and
 * call `next()`.
 *
 * @typeParam TState - Accumulated per-request state
 */
export interface HttpContext<TState extends object = object> extends MiddlewareContextBase<TState> {
  /** Incoming request. Read-only — use `state` for shared mutable data. */
  readonly request: Request;

  /**
   * The response being built. Mutable via `Response.headers.set(...)`,
   * or replaceable by returning a new `Response` from the handler.
   */
  response: Response;

  /**
   * Route parameters extracted by the router (`/users/:id` → `{ id }`).
   */
  readonly params: Record<string, string>;

  /** Parsed URL — cached to avoid repeated `new URL(request.url)`. */
  readonly url: URL;
}
