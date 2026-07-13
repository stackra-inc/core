/**
 * @file index.ts
 * @module @stackra/ssr/middleware/interfaces
 * @description Barrel export for every middleware interface.
 */

export type { MiddlewareContextBase } from './middleware-context-base.interface';
export type { HttpContext } from './http-context.interface';
export type { UiContext, UiLocation, UiRouteMatch } from './ui-context.interface';
export type { PipeContext } from './pipe-context.interface';
export type { MiddlewareOptions, MiddlewareClassRef } from './middleware-options.interface';
export type { MiddlewareGroup } from './middleware-group.interface';
export type { MiddlewareModuleOptions } from './middleware-module-options.interface';
export type { ResolvedMiddleware } from './resolved-middleware.interface';
export type { RouteResolutionInput } from './route-resolution-input.interface';
