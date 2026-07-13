/**
 * @file signal-to-response.util.ts
 * @module @stackra/ssr/core/server/utils
 * @description Convert middleware control-flow signals to `Response`s.
 *
 *   Middleware signals `redirect(url)`, `notFound(reason)`, and
 *   `abort(result)` throw dedicated signal instances. The server
 *   runtime catches them at the outer boundary and maps them to
 *   appropriate HTTP responses via this utility.
 */

import {
  AbortSignal as MiddlewareAbortSignal,
  NotFoundSignal,
  RedirectSignal,
} from '../../middleware';

/**
 * Map a middleware control-flow signal to a `Response`.
 *
 * Returns `null` for non-signal errors — callers should re-throw those
 * or produce their own error response.
 *
 * @param err - The caught error / signal.
 */
export function signalToResponse(err: unknown): Response | null {
  if (err instanceof RedirectSignal) {
    return new Response(null, {
      status: err.status,
      headers: { location: err.url },
    });
  }

  if (err instanceof NotFoundSignal) {
    return new Response(err.reason, {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  if (err instanceof MiddlewareAbortSignal) {
    if (err.result instanceof Response) return err.result;
    if (typeof err.result === 'string') {
      return new Response(err.result, {
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }
    return new Response(JSON.stringify(err.result), {
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  return null;
}

/**
 * Fallback error → `Response` mapper. Turns anything into a 500.
 *
 * Used as the last-resort mapper when `signalToResponse` returns `null`
 * — the caller can decide whether to expose the underlying error message
 * (dev) or produce a generic response (prod).
 *
 * @param err     - The caught error.
 * @param exposeError - Whether to include the error message in the body.
 */
export function errorToResponse(err: unknown, exposeError = false): Response {
  const message = exposeError && err instanceof Error ? err.message : 'Internal Server Error';
  return new Response(message, {
    status: 500,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
