/**
 * @file route-discovery.service.ts
 * @module @stackra/ssr/core/server/services
 * @description Auto-discovery of `@Route()` / `@ApiRoute()` classes.
 *
 *   At module init, walks every DI provider, reads `ROUTE_METADATA_KEY`
 *   and `API_ROUTE_METADATA_KEY` metadata, and hydrates the matching
 *   registry. Requires the `DISCOVERY_SERVICE` peer — fail-soft when
 *   the discovery package isn't wired.
 *
 *   For each discovered `@Route()` class, we construct a `StackraRoute`
 *   from the metadata + a `Component` that resolves the class instance
 *   from the container and invokes its `render()` method.
 *
 *   For each discovered `@ApiRoute()` class, we construct a
 *   `StackraApiRoute` whose handler resolves the class instance from
 *   the container and invokes its `handle()` method.
 */

import type { ReactElement } from 'react';
import { Inject, Injectable, Optional } from '@stackra/container';
import type { IApplication, IDiscoveryService } from '@stackra/contracts';
import {
  API_ROUTE_METADATA_KEY,
  APPLICATION,
  DISCOVERY_SERVICE,
  ROUTE_METADATA_KEY,
} from '@stackra/contracts';
import type { OnApplicationBootstrap } from '@stackra/contracts';
import { getMetadata } from '@vivtel/metadata';

import type { HttpContext } from '../../middleware/interfaces';
import type {
  StackraApiHandler,
  StackraApiRoute,
} from '../../../react/types/stackra-api-route.type';
import type { StackraRoute } from '../../../react/types/stackra-route.type';
import type { ApiRouteMetadata, RouteMetadata } from '../interfaces/route-metadata.interface';
import { RouteRegistry } from './route-registry.service';
import { ApiRouteRegistry } from './api-route-registry.service';

/**
 * `RouteDiscovery` — discovers decorated route classes at bootstrap
 * time and registers them.
 */
@Injectable()
export class RouteDiscovery implements OnApplicationBootstrap {
  public constructor(
    private readonly routes: RouteRegistry,
    private readonly apiRoutes: ApiRouteRegistry,
    @Inject(APPLICATION) private readonly app: IApplication,
    @Optional() @Inject(DISCOVERY_SERVICE) private readonly discovery?: IDiscoveryService
  ) {}

  /**
   * Runs after every module has finished `onModuleInit` — ensures every
   * `@Route()` / `@ApiRoute()` provider is materialised before we scan.
   */
  public onApplicationBootstrap(): void {
    if (!this.discovery) return;
    this.discoverRoutes();
    this.discoverApiRoutes();
  }

  private discoverRoutes(): void {
    const providers = this.discovery!.getProvidersByMetadata(ROUTE_METADATA_KEY);
    for (const wrapper of providers) {
      const instance = wrapper.instance as object | null;
      if (!instance) continue;
      const ctor = (instance as { constructor?: Function }).constructor;
      if (!ctor) continue;
      const metadata = getMetadata<RouteMetadata>(ROUTE_METADATA_KEY, ctor as object);
      if (!metadata) continue;

      const route = this.buildRouteFromMetadata(metadata, ctor as new (...a: never[]) => object);
      this.routes.register(route, 'discovery', (ctor as { name?: string }).name);
    }
  }

  private discoverApiRoutes(): void {
    const providers = this.discovery!.getProvidersByMetadata(API_ROUTE_METADATA_KEY);
    for (const wrapper of providers) {
      const instance = wrapper.instance as object | null;
      if (!instance) continue;
      const ctor = (instance as { constructor?: Function }).constructor;
      if (!ctor) continue;
      const metadata = getMetadata<ApiRouteMetadata>(API_ROUTE_METADATA_KEY, ctor as object);
      if (!metadata) continue;

      const route = this.buildApiRouteFromMetadata(
        metadata,
        ctor as new (...a: never[]) => { handle: StackraApiHandler }
      );
      this.apiRoutes.register(route, 'discovery', (ctor as { name?: string }).name);
    }
  }

  private buildRouteFromMetadata(
    metadata: RouteMetadata,
    ctor: new (...a: never[]) => object
  ): StackraRoute {
    const app = this.app;
    const Component = function StackraDiscoveredRoute(): ReactElement | null {
      const instance = app.get(ctor) as { render?: () => ReactElement | null };
      if (typeof instance.render !== 'function') return null;
      return instance.render();
    };

    const route: StackraRoute = {
      path: metadata.path,
      middleware: metadata.middleware,
      handle: {
        meta: metadata.meta,
        ...(metadata.handle ?? {}),
      },
      // `Component` is the RRD v7 name; ReactRouter accepts either
      // `element` or `Component`.
      Component: Component as never,
      ...(metadata.index ? { index: true } : {}),
      ...(metadata.parent ? { parent: metadata.parent } : {}),
    } as StackraRoute;

    return route;
  }

  private buildApiRouteFromMetadata(
    metadata: ApiRouteMetadata,
    ctor: new (...a: never[]) => { handle: StackraApiHandler }
  ): StackraApiRoute {
    const app = this.app;
    const handler: StackraApiHandler =
      metadata.handler ??
      (async (ctx: HttpContext) => {
        const instance = app.get(ctor) as { handle?: StackraApiHandler };
        if (typeof instance.handle !== 'function') {
          throw new Error(
            `@ApiRoute(${metadata.path}): ${(ctor as { name?: string }).name ?? 'anonymous'} does not implement handle().`
          );
        }
        return await instance.handle(ctx);
      });

    return {
      path: metadata.path,
      method: metadata.method,
      middleware: metadata.middleware,
      handler,
      meta: metadata.meta,
    };
  }
}
