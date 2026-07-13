/**
 * @file redirect.util.ts
 * @module @stackra/ssr/middleware/utils
 * @description Helper that throws a `RedirectSignal`.
 */

import { RedirectSignal } from '../signals/redirect.signal';

/**
 * Terminate the current middleware chain and redirect to `url`.
 *
 * Throws a `RedirectSignal` which the outer runtime catches and
 * converts to the appropriate stage-specific outcome — a `Response`
 * on HTTP, a router navigation on UI.
 *
 * @param url    - Absolute or relative URL to redirect to
 * @param status - HTTP status code in `[300, 308]`. Defaults to `302`.
 */
export function redirect(url: string, status: number = 302): never {
  throw new RedirectSignal(url, status);
}
