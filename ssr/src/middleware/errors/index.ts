/**
 * @file index.ts
 * @module @stackra/ssr/middleware/errors
 * @description Barrel export for every middleware error class.
 */

export {
  MiddlewareExecutionError,
  type MiddlewareExecutionErrorCode,
  type MiddlewareExecutionErrorMeta,
} from './middleware-execution.error';

export {
  MiddlewareResolutionError,
  type MiddlewareResolutionErrorCode,
  type MiddlewareResolutionErrorMeta,
} from './middleware-resolution.error';
