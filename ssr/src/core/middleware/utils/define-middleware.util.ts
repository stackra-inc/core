/**
 * @file define-middleware.util.ts
 * @module @stackra/ssr/middleware/utils
 * @description `defineMiddleware()` — the canonical primitive for authoring middleware.
 *
 *   Runtime is a pure identity function — `return input`. The value is
 *   entirely in the overload set: each of the three call shapes preserves
 *   generics without widening.
 *
 *   For the class-form overload, we additionally attach the options blob
 *   as `MIDDLEWARE_METADATA_KEY` reflect metadata so the resolver and
 *   registry can introspect metadata without instantiating the class.
 */

import 'reflect-metadata';

import { MIDDLEWARE_METADATA_KEY } from '../constants/metadata-keys.constant';
import type {
  MiddlewareClassRef,
  MiddlewareOptions,
} from '../interfaces/middleware-options.interface';
import type { MiddlewareDefinition } from '../types/middleware-definition.type';
import type { MiddlewareHandler } from '../types/middleware-handler.type';

/**
 * Function-form overload — a bare handler function.
 */
export function defineMiddleware<
  TContext extends object = object,
  TResult = unknown,
  TParams extends readonly unknown[] = readonly [],
>(
  handler: MiddlewareHandler<TContext, TResult, TParams>
): MiddlewareHandler<TContext, TResult, TParams>;

/**
 * Options-form overload — a full metadata object with either `handle`
 * or `resolve`.
 */
export function defineMiddleware<
  TContext extends object = object,
  TResult = unknown,
  TState extends object = object,
  TParams extends readonly unknown[] = readonly [],
>(
  options: MiddlewareOptions<TContext, TResult, TState, TParams>
): MiddlewareOptions<TContext, TResult, TState, TParams>;

/**
 * Class-form overload — a class constructor whose instance has a
 * `handle` method. Metadata (`name`, `priority`, etc.) is attached
 * via `reflect-metadata` under `MIDDLEWARE_METADATA_KEY`.
 */
export function defineMiddleware<
  TContext extends object,
  TResult,
  TParams extends readonly unknown[],
>(
  cls: MiddlewareClassRef<TContext, TResult, TParams>,
  options?: Omit<MiddlewareOptions<TContext, TResult, object, TParams>, 'handle' | 'resolve'>
): MiddlewareClassRef<TContext, TResult, TParams>;

/**
 * Implementation signature — falls back to the widest type.
 */
export function defineMiddleware(
  input: MiddlewareDefinition | MiddlewareClassRef,
  options?: Omit<MiddlewareOptions, 'handle' | 'resolve'>
): MiddlewareDefinition | MiddlewareClassRef {
  // Class-form with optional metadata — attach as reflect-metadata so the
  // resolver can read it without instantiating the class.
  if (typeof input === 'function' && isClassConstructor(input) && options) {
    Reflect.defineMetadata(MIDDLEWARE_METADATA_KEY, options, input);
  }
  return input;
}

/**
 * Detect whether a value is a class constructor. Used to distinguish
 * function-form middleware from class-form. Class detection is
 * source-string based (`class ...`) — safe for normal class syntax,
 * degraded but functional for minified output.
 */
function isClassConstructor(value: unknown): value is MiddlewareClassRef {
  if (typeof value !== 'function') return false;
  const source = Function.prototype.toString.call(value);
  return /^class[\s{]/.test(source);
}
