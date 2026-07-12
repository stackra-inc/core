/**
 * @file ui-context.interface.ts
 * @module @stackra/ssr/middleware/interfaces
 * @description Context passed to `stage: 'ui'` middleware — client-side only.
 */

import type { MiddlewareContextBase } from './middleware-context-base.interface';

/**
 * Minimal shape mirroring React Router's `Location` — declared inline to
 * avoid a hard peer dependency on `react-router-dom` at the type level.
 */
export interface UiLocation {
  readonly pathname: string;
  readonly search: string;
  readonly hash: string;
  readonly state: unknown;
  readonly key: string;
}

/**
 * Minimal shape mirroring React Router's `RouteMatch` — declared inline for
 * the same reason as `UiLocation`.
 */
export interface UiRouteMatch {
  readonly pathname: string;
  readonly params: Record<string, string | undefined>;
  readonly route: { readonly id?: string; readonly path?: string };
}

/**
 * Client-side UI context. Populated by the router adapter before running
 * navigation guard middleware.
 *
 * @typeParam TState - Accumulated per-navigation state
 */
export interface UiContext<TState extends object = object> extends MiddlewareContextBase<TState> {
  /** Current router location. */
  readonly location: UiLocation;

  /**
   * The list of matched route branches for the current navigation.
   * Ordered outermost → innermost.
   */
  readonly matches: readonly UiRouteMatch[];

  /**
   * Route parameters extracted by the router for the leaf match.
   */
  readonly params: Record<string, string | undefined>;

  /**
   * Abort signal that fires when the user navigates away before this
   * middleware completes. Consumers should thread it through async work
   * (fetch, timers, etc).
   */
  readonly signal: AbortSignal;
}
