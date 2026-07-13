/**
 * @file route-descriptor.interface.ts
 * @module @stackra/ssr/core/server/interfaces
 * @description Internal shape used by `RouteRegistry` to store routes.
 *
 *   A descriptor unifies routes contributed by three sources:
 *     - Config      — declarative arrays passed to `SsrModule.forRoot({...})`.
 *     - Discovery   — classes decorated with `@Route()`, picked up by
 *                     `RouteDiscovery` via `DISCOVERY_SERVICE`.
 *     - Feature     — `SsrModule.forFeature({...})` calls from sub-modules.
 *
 *   Descriptors are normalised into `StackraRoute[]` trees on demand by
 *   `RouteRegistry.getTree()`.
 */

import type { StackraRoute } from '../../../react/types/stackra-route.type';

/**
 * Source of a registered route — used for dev tools introspection.
 */
export type RouteSource = 'config' | 'feature' | 'discovery';

/**
 * A registered route entry inside `RouteRegistry`.
 */
export interface RouteDescriptor {
  /** The route object accepted by React Router. */
  readonly route: StackraRoute;
  /** Where this route came from. */
  readonly source: RouteSource;
  /** Optional origin identifier — class name for discovery, feature module name for feature. */
  readonly origin?: string;
  /** Sequential index — preserves declaration order for stable sorting. */
  readonly declarationIndex: number;
}
