/**
 * @file middleware.module.ts
 * @module @stackra/ssr/middleware
 * @description DI module for the middleware runtime.
 *
 *   `forRoot()` wires the registry, resolver, discovery loader, and the
 *   `APPLICATION` alias — it registers no middleware.
 *
 *   Middleware is registered two ways:
 *     1. **Decorators (preferred)** — `@Middleware()` classes are
 *        auto-discovered by `MiddlewareDiscovery` at `onApplicationBootstrap`.
 *     2. **`forFeature({ middleware, groups })`** — seeds inline
 *        `defineMiddleware(...)` / `defineMiddlewareGroup(...)` values.
 *        Seeding runs inside a lifecycle-aware loader (a provider that
 *        implements `onApplicationBootstrap`) — not a side-effecting
 *        `useFactory` marker, and not the registry itself.
 */

import { Module, ModuleRef, type DynamicModule } from '@stackra/container';
import { APPLICATION, MIDDLEWARE_REGISTRY, MIDDLEWARE_RESOLVER } from '@stackra/contracts';

import type { MiddlewareModuleOptions } from './interfaces/middleware-module-options.interface';
import { MiddlewareRegistry } from './services/middleware-registry.service';
import { MiddlewareResolver } from './services/middleware-resolver.service';
import { MiddlewareDiscovery } from './services/middleware-discovery.service';
import { createSeedLoader, seedLoaderToken } from '../server/utils/seed-loader.util';

/**
 * The `@stackra/ssr/middleware` module.
 */
@Module({})
export class MiddlewareModule {
  /**
   * Global registration — wires the registry, resolver, discovery, and
   * the `APPLICATION` alias. Registers no middleware; use `@Middleware()`
   * classes or `forFeature(...)`.
   */
  public static forRoot(): DynamicModule {
    return {
      module: MiddlewareModule,
      global: true,
      providers: [
        // Expose the live container under APPLICATION — the container
        // auto-registers `ModuleRef` per module but not this alias.
        { provide: APPLICATION, useExisting: ModuleRef },
        MiddlewareRegistry,
        { provide: MIDDLEWARE_REGISTRY, useExisting: MiddlewareRegistry },
        MiddlewareResolver,
        { provide: MIDDLEWARE_RESOLVER, useExisting: MiddlewareResolver },
        MiddlewareDiscovery,
      ],
      exports: [
        APPLICATION,
        MiddlewareRegistry,
        MIDDLEWARE_REGISTRY,
        MiddlewareResolver,
        MIDDLEWARE_RESOLVER,
      ],
    };
  }

  /**
   * Feature-module registration — seeds inline middleware / groups.
   *
   * The seeding runs in a lifecycle loader (`onApplicationBootstrap`),
   * so it happens after core wiring and alongside decorator discovery.
   */
  public static forFeature(options: MiddlewareModuleOptions): DynamicModule {
    const token = seedLoaderToken('middleware-seed');
    return {
      module: MiddlewareModule,
      providers: [
        {
          provide: token,
          useFactory: (registry: MiddlewareRegistry) =>
            createSeedLoader(() => {
              for (const group of options.groups ?? []) registry.registerGroup(group);
              for (const def of options.middleware ?? []) registry.register(def);
            }),
          inject: [MiddlewareRegistry],
        },
      ],
      exports: [],
    };
  }
}
