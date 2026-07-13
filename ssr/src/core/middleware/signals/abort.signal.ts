/**
 * @file abort.signal.ts
 * @module @stackra/ssr/middleware/signals
 * @description Control-flow signal thrown by the `abort()` helper.
 *
 *   Note: this is a middleware short-circuit signal, distinct from the
 *   Web platform's `AbortSignal` (used for fetch cancellation).
 */

export const ABORT_SIGNAL_KIND = 'abort' as const;

/**
 * Signal indicating the middleware chain should terminate immediately
 * with the provided result. The result flows straight to the outer
 * boundary — no further middleware runs.
 */
export class AbortSignal extends Error {
  public readonly kind = ABORT_SIGNAL_KIND;
  public readonly result: unknown;

  public constructor(result: unknown) {
    super('Middleware chain aborted');
    this.name = 'AbortSignal';
    this.result = result;
  }
}
