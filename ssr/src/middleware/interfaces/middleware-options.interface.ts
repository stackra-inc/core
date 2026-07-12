/**
 * @file middleware-options.interface.ts
 * @module @stackra/ssr/middleware/interfaces
 * @description Options-form shape accepted by `defineMiddleware`.
 */

import type { IApplication } from '@stackra/contracts';

import type { MiddlewareRunOn } from '../enums/middleware-run-on.enum';
import type { MiddlewareStage } from '../enums/middleware-stage.enum';
import type { MiddlewareHandler } from '../types/middleware-handler.type';

/**
 * A resolvable class constructor — used by `options.resolve` for
 * DI-integrated middleware.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MiddlewareClassRef<
  TContext extends object = object,
  TResult = unknown,
  TParams extends readonly unknown[] = readonly any[],
> {
  new (...args: never[]): { handle: MiddlewareHandler<TContext, TResult, TParams> };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Full options payload accepted by `defineMiddleware({...})`.
 *
 * Consumers pick exactly one of `handle` (inline handler) or `resolve`
 * (container-provided class). Mixing both produces a type error.
 *
 * @typeParam TCtx    - Stage-specific context shape
 * @typeParam TResult - Value returned by the handler
 * @typeParam TState  - Any state additions this middleware promises to add
 * @typeParam TParams - Extra params accepted by tuple invocations
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MiddlewareOptions<
  TCtx extends object = object,
  TResult = unknown,
  TState extends object = object,
  TParams extends readonly unknown[] = readonly any[],
> {
  /**
   * Human-readable identifier. Must be unique per registry. Required for
   * middleware that can be referenced by string in route/group tables.
   *
   * Anonymous middleware (no `name`) is legal but cannot be referenced by
   * name from other config.
   */
  readonly name?: string;

  /** Free-form description surfaced in dev tools and errors. */
  readonly description?: string;

  /**
   * Execution priority. Higher runs earlier. Defaults to `0`.
   * Ties are broken by declaration order.
   */
  readonly priority?: number;

  /**
   * Environment predicate — `'server'`, `'client'`, or `'both'`.
   * Defaults to `'both'`.
   */
  readonly runOn?: MiddlewareRunOn;

  /**
   * Stage predicate — controls which context variant this middleware
   * expects (`http`, `ui`, or `pipe`). Also filters the chain at
   * resolution time.
   */
  readonly stage?: MiddlewareStage;

  /**
   * Names of middleware this one must run after. Strings referenced by
   * name go through the registry; anonymous references throw
   * `MIDDLEWARE_UNKNOWN_REFERENCE`.
   */
  readonly dependsOn?: readonly string[];

  /**
   * Enablement predicate. Either a static boolean or a factory invoked
   * once per resolution with the DI container. Throwing raises
   * `MIDDLEWARE_ENABLED_THREW`.
   */
  readonly enabled?: boolean | ((container: IApplication) => boolean);

  /**
   * State keys this middleware guarantees to write. Used by
   * `ComposeMiddleware<Chain>` to accumulate the state type.
   */
  readonly stateAdditions?: readonly (keyof TState)[];

  /**
   * Inline handler. Mutually exclusive with `resolve`.
   */
  readonly handle?: MiddlewareHandler<TCtx, TResult, TParams>;

  /**
   * Class constructor resolved via the DI container. Instantiated once
   * per resolution and cached. Mutually exclusive with `handle`.
   */
  readonly resolve?: MiddlewareClassRef<TCtx, TResult, TParams>;

  /**
   * Free-form metadata. Ignored by the runtime — surface for consumer
   * extensions (audit tags, feature flags, docs links).
   */
  readonly meta?: Readonly<Record<string, unknown>>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
