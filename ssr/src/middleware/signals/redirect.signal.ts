/**
 * @file redirect.signal.ts
 * @module @stackra/ssr/middleware/signals
 * @description Control-flow signal thrown by the `redirect()` helper.
 */

/**
 * Discriminated kind literal — enables `instanceof`-free detection.
 */
export const REDIRECT_SIGNAL_KIND = 'redirect' as const;

/**
 * Signal indicating the middleware chain should terminate with an HTTP
 * redirect. Caught at the outer pipeline boundary and converted to a
 * `Response` (server) or router navigation (client).
 *
 * Status code must be in the 300–308 range. Anything else throws
 * `TypeError` at construction time.
 */
export class RedirectSignal extends Error {
  public readonly kind = REDIRECT_SIGNAL_KIND;
  public readonly url: string;
  public readonly status: number;

  public constructor(url: string, status: number = 302) {
    if (!Number.isInteger(status) || status < 300 || status > 308) {
      throw new TypeError(
        `RedirectSignal: status must be an integer in [300, 308], got ${status}.`
      );
    }
    super(`Redirect to ${url} (${status})`);
    this.name = 'RedirectSignal';
    this.url = url;
    this.status = status;
  }
}
