/**
 * @file compose-middleware.util.ts
 * @module @stackra/ssr/middleware/utils
 * @description Variadic combiner that sequences an arbitrary number of
 *   middleware definitions into a single equivalent middleware.
 */

import type { MiddlewareHandler } from '../types/middleware-handler.type';
import type { MiddlewareNext } from '../types/middleware-next.type';
import type { MiddlewareOptions } from '../interfaces/middleware-options.interface';
import type { MiddlewareDefinition } from '../types/middleware-definition.type';

/**
 * Combine `chain` into a single middleware definition. Runs each entry
 * left-to-right — the first entry sees `ctx` and receives a `next` that
 * runs the second entry, and so on. The last entry's `next` is the
 * original outer next.
 *
 * Only function-form and options-with-handle forms are supported by
 * `composeMiddleware` — class-form entries are resolved lazily and
 * cannot be composed synchronously. Callers who need to include class
 * middleware in a composed chain should register the class via a
 * module and reference it by name in a group.
 */
export function composeMiddleware(...chain: readonly MiddlewareDefinition[]): MiddlewareDefinition {
  const handlers: MiddlewareHandler[] = chain.map((entry) => extractHandler(entry));

  const composed: MiddlewareHandler = async (ctx, outerNext) => {
    let index = -1;

    const dispatch = async (i: number): Promise<unknown> => {
      if (i <= index) {
        throw new Error('next() called multiple times inside a composed middleware.');
      }
      index = i;
      const handler = handlers[i];
      if (!handler) return await outerNext();
      const next: MiddlewareNext = () => dispatch(i + 1) as Promise<unknown>;
      return await handler(ctx, next);
    };

    return await dispatch(0);
  };

  return composed;
}

/**
 * Extract a plain handler from a definition. Options form with `handle`
 * returns the inline handler. Function form is returned as-is. Anything
 * else throws.
 */
function extractHandler(def: MiddlewareDefinition): MiddlewareHandler {
  if (typeof def === 'function') {
    return def as MiddlewareHandler;
  }
  if (
    typeof def === 'object' &&
    def !== null &&
    'handle' in def &&
    typeof (def as MiddlewareOptions).handle === 'function'
  ) {
    return (def as MiddlewareOptions).handle!;
  }
  throw new Error(
    'composeMiddleware only accepts function-form or options-with-handle middleware. ' +
      'Register class-form middleware in a module and reference it by name in a group.'
  );
}
