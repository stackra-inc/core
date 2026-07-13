/**
 * @file api-route-registry.service.ts
 * @module @stackra/ssr/core/server/services
 * @description The API route registry.
 *
 *   Same three-source model as `RouteRegistry` (config, feature,
 *   discovery). Populates itself in `onModuleInit()` from `SSR_CONFIG`.
 *   Exposes `match(request)` for the renderer to check API routes
 *   before UI routes.
 */

import { Injectable } from '@stackra/container';

import { matchApiRoute, type ApiRouteMatch } from '../utils/match-api-route.util';
import type { StackraApiRoute } from '../../../react/types/stackra-api-route.type';
import type { ApiRouteDescriptor } from '../interfaces/api-route-descriptor.interface';
import type { RouteSource } from '../interfaces/route-descriptor.interface';

/**
 * The API route registry.
 *
 * Purely imperative — populated by `RouteDiscovery` (scanning
 * `@ApiRoute()` classes) and by `SsrModule.forFeature({ apiRoutes })`
 * at wire time. Holds no config, no lifecycle hook.
 */
@Injectable()
export class ApiRouteRegistry {
  private readonly descriptors: ApiRouteDescriptor[] = [];
  private counter = 0;

  /**
   * Register a single API route.
   */
  public register(route: StackraApiRoute, source: RouteSource, origin?: string): void {
    this.descriptors.push({
      route,
      source,
      origin,
      declarationIndex: this.counter++,
    });
  }

  /**
   * Register many API routes at once.
   */
  public registerMany(
    routes: readonly StackraApiRoute[],
    source: RouteSource,
    origin?: string
  ): void {
    for (const route of routes) {
      this.register(route, source, origin);
    }
  }

  /**
   * All registered API routes as an array (flattens descriptors).
   */
  public list(): readonly StackraApiRoute[] {
    return this.descriptors.map((d) => d.route);
  }

  /**
   * Return descriptors for introspection.
   */
  public listDescriptors(): readonly ApiRouteDescriptor[] {
    return this.descriptors;
  }

  /**
   * Match an incoming request against the registry.
   */
  public match(request: Request): ApiRouteMatch | null {
    return matchApiRoute(this.list(), request);
  }

  /**
   * Reset — test-only.
   */
  public clear(): void {
    this.descriptors.length = 0;
    this.counter = 0;
  }
}
