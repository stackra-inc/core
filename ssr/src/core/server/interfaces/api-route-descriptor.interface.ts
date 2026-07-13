/**
 * @file api-route-descriptor.interface.ts
 * @module @stackra/ssr/core/server/interfaces
 * @description Internal shape used by `ApiRouteRegistry` to store routes.
 */

import type { StackraApiRoute } from '../../../react/types/stackra-api-route.type';
import type { RouteSource } from './route-descriptor.interface';

/**
 * A registered API route entry inside `ApiRouteRegistry`.
 */
export interface ApiRouteDescriptor {
  /** The API route configuration. */
  readonly route: StackraApiRoute;
  /** Source (config / feature / discovery). */
  readonly source: RouteSource;
  /** Optional origin — class name or feature module name. */
  readonly origin?: string;
  /** Declaration order. */
  readonly declarationIndex: number;
}
