/**
 * @file middleware-resolution.error.ts
 * @module @stackra/ssr/middleware/errors
 * @description Error raised while the resolver builds the middleware chain.
 */

/**
 * Union of every code that can be attached to a
 * `MiddlewareResolutionError`.
 */
export type MiddlewareResolutionErrorCode =
  | 'MIDDLEWARE_UNKNOWN_REFERENCE'
  | 'MIDDLEWARE_ANONYMOUS_REFERENCE'
  | 'MIDDLEWARE_CYCLE_DETECTED'
  | 'MIDDLEWARE_ENABLED_THREW'
  | 'MIDDLEWARE_STAGE_MISMATCH'
  | 'MIDDLEWARE_INVALID_DEFINITION';

/**
 * Metadata payload attached to every `MiddlewareResolutionError`.
 */
export interface MiddlewareResolutionErrorMeta {
  readonly [key: string]: unknown;
}

/**
 * Raised when the resolver cannot produce a valid chain — typically
 * because of unknown references, cycles, or misconfigured predicates.
 *
 * Preserves the original error via the `cause` chain when applicable.
 */
export class MiddlewareResolutionError extends Error {
  public readonly code: MiddlewareResolutionErrorCode;
  public readonly meta: MiddlewareResolutionErrorMeta;

  public constructor(
    message: string,
    code: MiddlewareResolutionErrorCode,
    meta: MiddlewareResolutionErrorMeta = {},
    cause?: unknown
  ) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = 'MiddlewareResolutionError';
    this.code = code;
    this.meta = meta;
  }
}
