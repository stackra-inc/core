/**
 * @file run-middleware.ts
 * @module @stackra/ssr/testing
 * @description Standalone helper that runs a middleware against a context.
 *
 *   Consumers prefer this over `ctx.runMiddleware(mw)` when they want a
 *   functional API — for example, mapping over an array of middleware in
 *   a data-driven test.
 */

import type {
  MiddlewareClassRef,
  MiddlewareOptions,
} from '../core/middleware/interfaces/middleware-options.interface';
import type { MiddlewareDefinition } from '../core/middleware/types/middleware-definition.type';
import type { MiddlewareHandler } from '../core/middleware/types/middleware-handler.type';
import type { MiddlewareNext } from '../core/middleware/types/middleware-next.type';
import { isClass } from '../core/middleware/utils/is-class.util';

/**
 * Execute a middleware against a context. If `next` is omitted, a no-op
 * next returning `undefined` is used.
 */
export async function runMiddleware(
  middleware: MiddlewareDefinition,
  ctx: object,
  next?: MiddlewareNext
): Promise<unknown> {
  const effectiveNext: MiddlewareNext = next ?? (async () => undefined);

  // Options form with handle
  if (
    typeof middleware === 'object' &&
    middleware !== null &&
    'handle' in middleware &&
    typeof (middleware as MiddlewareOptions).handle === 'function'
  ) {
    return await (middleware as MiddlewareOptions).handle!(ctx, effectiveNext);
  }

  // Options form with resolve — instantiate ad hoc for tests.
  if (
    typeof middleware === 'object' &&
    middleware !== null &&
    'resolve' in middleware &&
    typeof (middleware as MiddlewareOptions).resolve === 'function'
  ) {
    const cls = (middleware as MiddlewareOptions).resolve!;
    const instance = new cls() as { handle: MiddlewareHandler };
    return await instance.handle(ctx, effectiveNext);
  }

  // Class form
  if (typeof middleware === 'function' && isClass(middleware)) {
    const instance = new (middleware as MiddlewareClassRef)() as { handle: MiddlewareHandler };
    return await instance.handle(ctx, effectiveNext);
  }

  // Function form
  if (typeof middleware === 'function') {
    return await (middleware as MiddlewareHandler)(ctx, effectiveNext);
  }

  throw new Error(`runMiddleware: unsupported middleware form (${typeof middleware}).`);
}
