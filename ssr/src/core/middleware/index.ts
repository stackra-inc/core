/**
 * @file index.ts
 * @module @stackra/ssr/middleware
 * @description Public API surface of the `@stackra/ssr/middleware` subpath.
 *
 *   Consumers import from this module — everything else is internal.
 */

// ════════════════════════════════════════════════════════════════════════════════
// Primitives
// ════════════════════════════════════════════════════════════════════════════════
export {
  defineMiddleware,
  defineMiddlewareGroup,
  composeMiddleware,
  toPipe,
  wrapNext,
  redirect,
  notFound,
  abort,
} from './utils';

// ════════════════════════════════════════════════════════════════════════════════
// Module
// ════════════════════════════════════════════════════════════════════════════════
export { MiddlewareModule } from './middleware.module';

// ════════════════════════════════════════════════════════════════════════════════
// Decorators
// ════════════════════════════════════════════════════════════════════════════════
export { Middleware, type MiddlewareDecoratorOptions } from './decorators';

// ════════════════════════════════════════════════════════════════════════════════
// Services
// ════════════════════════════════════════════════════════════════════════════════
export { MiddlewareRegistry, MiddlewareResolver, MiddlewareDiscovery } from './services';
export type { RegisteredMiddleware } from './services';

// ════════════════════════════════════════════════════════════════════════════════
// Enums / Constants
// ════════════════════════════════════════════════════════════════════════════════
export { MiddlewareStage, MiddlewareRunOn } from './enums';
export {
  MIDDLEWARE_METADATA_KEY,
  MIDDLEWARE_DISCOVERY_KEY,
  DEFAULT_PRIORITY,
  DEFAULT_RUN_ON,
  DEFAULT_STAGE,
} from './constants';

// ════════════════════════════════════════════════════════════════════════════════
// Signals
// ════════════════════════════════════════════════════════════════════════════════
export {
  RedirectSignal,
  NotFoundSignal,
  AbortSignal,
  REDIRECT_SIGNAL_KIND,
  NOT_FOUND_SIGNAL_KIND,
  ABORT_SIGNAL_KIND,
} from './signals';

// ════════════════════════════════════════════════════════════════════════════════
// Errors
// ════════════════════════════════════════════════════════════════════════════════
export { MiddlewareExecutionError, MiddlewareResolutionError } from './errors';
export type {
  MiddlewareExecutionErrorCode,
  MiddlewareExecutionErrorMeta,
  MiddlewareResolutionErrorCode,
  MiddlewareResolutionErrorMeta,
} from './errors';

// ════════════════════════════════════════════════════════════════════════════════
// Interfaces (type-only exports)
// ════════════════════════════════════════════════════════════════════════════════
export type {
  MiddlewareContextBase,
  HttpContext,
  UiContext,
  UiLocation,
  UiRouteMatch,
  PipeContext,
  MiddlewareOptions,
  MiddlewareClassRef,
  MiddlewareGroup,
  MiddlewareModuleOptions,
  ResolvedMiddleware,
  RouteResolutionInput,
} from './interfaces';

// ════════════════════════════════════════════════════════════════════════════════
// Types (type-only exports)
// ════════════════════════════════════════════════════════════════════════════════
export type {
  MiddlewareNext,
  MiddlewareHandler,
  MiddlewareDefinition,
  MiddlewareTuple,
  ComposeMiddleware,
} from './types';
