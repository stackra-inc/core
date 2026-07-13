/**
 * @file stackra-route.type.ts
 * @module @stackra/ssr/react/types
 * @description Extended `RouteObject` shape with middleware attachment.
 *
 *   `StackraRoute` mirrors React Router v7's `RouteObject` but adds a
 *   typed `middleware` array. At runtime the router adapter wraps each
 *   route's loader so the middleware chain runs before the loader.
 */

import type { RouteObject } from 'react-router-dom';

import type { MiddlewareDefinition, MiddlewareTuple } from '../../core/middleware';
import type { SeoDescriptor } from '../../core/seo';
import type { MetaTags } from './meta-tags.type';

/**
 * Handle payload attached to routes — surfaced by `useMatches()`.
 *
 * Downstream code reads `meta` in `<Meta />` and `middlewareState` via
 * `useMiddlewareState()`.
 */
export interface StackraRouteHandle {
  /**
   * Full SEO / AEO descriptor for this route level — title, description,
   * OpenGraph, Twitter, JSON-LD, robots, canonical, alternates.
   * Merged down the match chain by `SeoService`.
   */
  readonly seo?: SeoDescriptor;
  /**
   * Lightweight meta tags. Deprecated in favour of `seo` — kept for
   * back-compat. When both are present, `seo` wins.
   *
   * @deprecated Use `seo` instead.
   */
  readonly meta?: MetaTags;
  /**
   * State populated by upstream middleware for this match. The router
   * adapter writes into this field before invoking the loader; read it
   * with `useRouteState()`.
   */
  readonly middlewareState?: unknown;
  /** Extra handle fields — free-form, ignored by the runtime. */
  readonly [key: string]: unknown;
}

/**
 * Route entry accepted by `defineRoutes(...)`.
 *
 * Every field is a superset of RRD's `RouteObject` so the result is
 * passed verbatim to `createBrowserRouter` / `createStaticHandler`.
 */
export type StackraRoute = Omit<RouteObject, 'handle' | 'children' | 'middleware'> & {
  /**
   * Middleware attached to this route.
   *
   * Accepts every form the resolver understands — inline definitions,
   * named references, tuples for parameterized middleware, and group
   * references (`'@web'`, `'@auth'`, ...).
   */
  readonly middleware?: readonly (MiddlewareDefinition | string | MiddlewareTuple)[];
  /** Structured handle payload with typed `meta`. */
  readonly handle?: StackraRouteHandle;
  /** Nested routes — recursive `StackraRoute`. */
  readonly children?: readonly StackraRoute[];
};
