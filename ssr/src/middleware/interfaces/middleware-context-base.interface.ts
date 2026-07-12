/**
 * @file middleware-context-base.interface.ts
 * @module @stackra/ssr/middleware/interfaces
 * @description Base shape shared by every stage-specific middleware context.
 */

import type { IApplication } from '@stackra/contracts';

/**
 * Shared context surface for every middleware invocation.
 *
 * Every stage (`HTTP`, `UI`, `PIPE`) extends this base — providing at least
 * a live DI container reference and a strongly-typed `state` bag that
 * downstream middleware can enrich.
 *
 * @typeParam TState - Accumulated per-request state (extended by upstream middleware)
 */
export interface MiddlewareContextBase<TState extends object = object> {
  /**
   * The application container. Middleware can resolve any registered
   * provider — services, config, tokens.
   */
  readonly container: IApplication;

  /**
   * Mutable per-request state bag. Upstream middleware writes here; the
   * type parameter accumulates keys via `ComposeMiddleware<Chain>` so
   * downstream handlers see a fully-typed union.
   */
  state: TState;
}
