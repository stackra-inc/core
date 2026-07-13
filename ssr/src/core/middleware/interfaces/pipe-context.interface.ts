/**
 * @file pipe-context.interface.ts
 * @module @stackra/ssr/middleware/interfaces
 * @description Context passed to `stage: 'pipe'` middleware — the generic
 *   passable-value variant used when middleware is invoked inside a raw
 *   `@stackra/pipeline` Pipeline that is not tied to HTTP or UI.
 */

import type { MiddlewareContextBase } from './middleware-context-base.interface';

/**
 * Generic pipeline context. Wraps an arbitrary passable value alongside
 * the standard container + state surface.
 *
 * @typeParam TPassable - The value being transformed by the pipeline
 * @typeParam TState    - Accumulated state
 */
export interface PipeContext<
  TPassable = unknown,
  TState extends object = object,
> extends MiddlewareContextBase<TState> {
  /** The passable value flowing through the pipeline. */
  passable: TPassable;
}
