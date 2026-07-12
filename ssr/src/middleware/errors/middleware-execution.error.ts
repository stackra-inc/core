/**
 * @file middleware-execution.error.ts
 * @module @stackra/ssr/middleware/errors
 * @description Error raised during middleware execution.
 */

import type { MiddlewareStage } from '../enums/middleware-stage.enum';

/**
 * Union of every code that can be attached to a
 * `MiddlewareExecutionError`. Programmatic consumers should match on
 * the code rather than the message text.
 */
export type MiddlewareExecutionErrorCode =
  | 'MIDDLEWARE_HANDLER_THREW'
  | 'MIDDLEWARE_RESOLUTION_FAILED'
  | 'NEXT_CALLED_MULTIPLE_TIMES'
  | 'NEXT_CALLED_AFTER_SHORT_CIRCUIT'
  | 'MIDDLEWARE_TIMED_OUT';

/**
 * Metadata payload attached to every `MiddlewareExecutionError`.
 */
export interface MiddlewareExecutionErrorMeta {
  readonly middlewareName: string;
  readonly stage?: MiddlewareStage;
  readonly [key: string]: unknown;
}

/**
 * Raised when a middleware fails at execution time.
 *
 * Carries a machine-readable `code`, a metadata blob with at minimum
 * the offending middleware's name, and preserves the original error
 * through the ES2022 `cause` chain.
 */
export class MiddlewareExecutionError extends Error {
  public readonly code: MiddlewareExecutionErrorCode;
  public readonly meta: MiddlewareExecutionErrorMeta;

  public constructor(
    message: string,
    code: MiddlewareExecutionErrorCode,
    meta: MiddlewareExecutionErrorMeta,
    cause?: unknown
  ) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = 'MiddlewareExecutionError';
    this.code = code;
    this.meta = meta;
  }
}
