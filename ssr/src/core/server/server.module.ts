/**
 * @file server.module.ts
 * @module @stackra/ssr/core/server
 * @description DI module for the routing + rendering runtime.
 *
 *   Wires the route registries, the renderer, and the route-discovery
 *   loader. Each registry populates itself in `onModuleInit()` from the
 *   injected `SSR_CONFIG`; `RouteDiscovery` scans decorated classes in
 *   `onApplicationBootstrap()`. No synthetic bootstrap class is used.
 *
 *   `ServerModule` is a building block — most consumers import the
 *   composite `SsrModule` (which bundles `MiddlewareModule` + `ServerModule`
 *   + `SeoModule`). It is exported standalone for advanced setups that
 *   want routing without SEO or middleware.
 */

import { Module, type DynamicModule } from '@stackra/container';
import type { IAsyncModuleOptions } from '@stackra/contracts';
import { API_ROUTE_REGISTRY, ROUTE_REGISTRY, SSR_CONFIG, SSR_RENDERER } from '@stackra/contracts';

import type { SsrModuleOptions } from './interfaces/ssr-module-options.interface';
import { ApiRouteRegistry } from './services/api-route-registry.service';
import { RouteDiscovery } from './services/route-discovery.service';
import { RouteRegistry } from './services/route-registry.service';
import { SsrRenderer } from './services/ssr-renderer.service';
import { mergeConfig } from './utils/merge-config.util';
import { createSeedLoader, seedLoaderToken } from './utils/seed-loader.util';

/**
 * The routing + rendering DI module.
 */
@Module({})
export class ServerModule {
  /**
   * Global registration — wires the registries, discovery, and renderer.
   * Registry population happens in each registry's `onModuleInit`.
   *
   * When `config` is provided it is registered under `SSR_CONFIG`.
   * The composite `SsrModule` passes its already-merged config here so
   * the value is registered exactly once.
   */
  public static forRoot(config?: SsrModuleOptions): DynamicModule {
    const providers = [
      RouteRegistry,
      { provide: ROUTE_REGISTRY, useExisting: RouteRegistry },
      ApiRouteRegistry,
      { provide: API_ROUTE_REGISTRY, useExisting: ApiRouteRegistry },
      SsrRenderer,
      { provide: SSR_RENDERER, useExisting: SsrRenderer },
      RouteDiscovery,
    ];

    return {
      module: ServerModule,
      global: true,
      providers: config ? [{ provide: SSR_CONFIG, useValue: config }, ...providers] : providers,
      exports: [
        SSR_CONFIG,
        RouteRegistry,
        ROUTE_REGISTRY,
        ApiRouteRegistry,
        API_ROUTE_REGISTRY,
        SsrRenderer,
        SSR_RENDERER,
      ],
    };
  }

  /**
   * Async factory variant — resolves options through `useFactory`
   * before running `mergeConfig`.
   */
  public static forRootAsync(options: IAsyncModuleOptions<SsrModuleOptions>): DynamicModule {
    return {
      module: ServerModule,
      global: true,
      imports: options.imports ?? [],
      providers: [
        {
          provide: SSR_CONFIG,
          useFactory: async (...args: unknown[]) => mergeConfig(await options.useFactory(...args)),
          inject: options.inject ?? [],
        },
        RouteRegistry,
        { provide: ROUTE_REGISTRY, useExisting: RouteRegistry },
        ApiRouteRegistry,
        { provide: API_ROUTE_REGISTRY, useExisting: ApiRouteRegistry },
        SsrRenderer,
        { provide: SSR_RENDERER, useExisting: SsrRenderer },
        RouteDiscovery,
      ],
      exports: [
        SSR_CONFIG,
        RouteRegistry,
        ROUTE_REGISTRY,
        ApiRouteRegistry,
        API_ROUTE_REGISTRY,
        SsrRenderer,
        SSR_RENDERER,
      ],
    };
  }

  /**
   * Feature-module registration — seeds additional routes / API routes.
   *
   * Seeding runs in a lifecycle loader (`onApplicationBootstrap`), so it
   * happens after core wiring and alongside decorator discovery.
   */
  public static forFeature(options: SsrModuleOptions): DynamicModule {
    const token = seedLoaderToken('route-seed');
    return {
      module: ServerModule,
      providers: [
        {
          provide: token,
          useFactory: (routes: RouteRegistry, apiRoutes: ApiRouteRegistry) =>
            createSeedLoader(() => {
              if (options.routes) routes.registerMany(options.routes, 'feature');
              if (options.apiRoutes) apiRoutes.registerMany(options.apiRoutes, 'feature');
            }),
          inject: [RouteRegistry, ApiRouteRegistry],
        },
      ],
      exports: [],
    };
  }
}
