/**
 * @file not-found.signal.ts
 * @module @stackra/ssr/middleware/signals
 * @description Control-flow signal thrown by the `notFound()` helper.
 */

export const NOT_FOUND_SIGNAL_KIND = 'not-found' as const;

/**
 * Signal indicating the middleware chain should terminate with a 404 /
 * not-found response. Caught at the outer pipeline boundary and mapped
 * to the appropriate stage-specific outcome (`Response` on HTTP,
 * error boundary on UI).
 */
export class NotFoundSignal extends Error {
  public readonly kind = NOT_FOUND_SIGNAL_KIND;
  public readonly reason: string;

  public constructor(reason: string = 'Not Found') {
    super(reason);
    this.name = 'NotFoundSignal';
    this.reason = reason;
  }
}
