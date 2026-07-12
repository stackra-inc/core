/**
 * @file middleware.module.ts
 * @module @stackra/ssr/middleware
 * @description DI module for the middleware runtime.
 */

import { Injectable, Module, type DynamicModule } from '@stackra/container';
import type { IAsyncModuleOptions } from '@stackra/contracts';
import { MIDDLEWARE_CONFIG, MIDDLEWARE_REGISTRY, MIDDLEWARE_RESOLVER } from '@stackra/contracts';

import { MIDDLEWARE_BOOTSTRAP } from './constants/metadata-keys.constant';
import type { MiddlewareModuleOptions } from './interfaces/middleware-module-options.interface';
import { MiddlewareRegistry } from './services/middleware-registry.service';
import { MiddlewareResolver } from './services/middleware-resolver.service';
import { mergeConfig } from './utils/merge-config.util';

/**
 * Bootstrap provider — instantiated once at container init to eagerly
 * populate the registry from the resolved config.
 */
@Injectable()
class MiddlewareBootstrap {
  public constructor(registry: MiddlewareRegistry, config: MiddlewareModuleOptions) {
    for (const group of config.groups ?? []) {
      registry.registerGroup(group);
    }
    for (const def of config.middleware ?? []) {
      registry.register(def);
    }
  }
}

/**
 * The `@stackra/ssr/middleware` module.
 *
 * Import once at the application root via `MiddlewareModule.forRoot({...})`.
 * Feature modules that need to extend the registry use `.forFeature({...})`.
 */
@Module({})
export class MiddlewareModule {
  /**
   * Global registration — declares the middleware runtime, wires the
   * registry / resolver services, and bootstraps the registry from
   * `options.middleware` and `options.groups`.
   */
  public static forRoot(options?: MiddlewareModuleOptions): DynamicModule {
    const config = mergeConfig(options);

    return {
      module: MiddlewareModule,
      global: true,
      providers: [
        { provide: MIDDLEWARE_CONFIG, useValue: config },
        MiddlewareRegistry,
        { provide: MIDDLEWARE_REGISTRY, useExisting: MiddlewareRegistry },
        MiddlewareResolver,
        { provide: MIDDLEWARE_RESOLVER, useExisting: MiddlewareResolver },
        {
          provide: MIDDLEWARE_BOOTSTRAP,
          useFactory: (registry: MiddlewareRegistry) => new MiddlewareBootstrap(registry, config),
          inject: [MiddlewareRegistry],
        },
      ],
      exports: [
        MIDDLEWARE_CONFIG,
        MiddlewareRegistry,
        MIDDLEWARE_REGISTRY,
        MiddlewareResolver,
        MIDDLEWARE_RESOLVER,
      ],
    };
  }

  /**
   * Async factory variant. Resolves the options through `useFactory`
   * before running `mergeConfig`.
   */
  public static forRootAsync(options: IAsyncModuleOptions<MiddlewareModuleOptions>): DynamicModule {
    return {
      module: MiddlewareModule,
      global: true,
      providers: [
        {
          provide: MIDDLEWARE_CONFIG,
          useFactory: async (...args: unknown[]) => mergeConfig(await options.useFactory(...args)),
          inject: options.inject ?? [],
        },
        MiddlewareRegistry,
        { provide: MIDDLEWARE_REGISTRY, useExisting: MiddlewareRegistry },
        MiddlewareResolver,
        { provide: MIDDLEWARE_RESOLVER, useExisting: MiddlewareResolver },
        {
          provide: MIDDLEWARE_BOOTSTRAP,
          useFactory: (registry: MiddlewareRegistry, config: MiddlewareModuleOptions) =>
            new MiddlewareBootstrap(registry, config),
          inject: [MiddlewareRegistry, MIDDLEWARE_CONFIG],
        },
      ],
      exports: [
        MIDDLEWARE_CONFIG,
        MiddlewareRegistry,
        MIDDLEWARE_REGISTRY,
        MiddlewareResolver,
        MIDDLEWARE_RESOLVER,
      ],
    };
  }

  /**
   * Feature-module registration. Extends the global registry with
   * additional middleware / groups without redeclaring the core services.
   */
  public static forFeature(options: MiddlewareModuleOptions): DynamicModule {
    // Unique symbol per feature registration so multiple feature modules
    // don't collide on the bootstrap provider token.
    const featureBootstrap = Symbol.for(
      `MIDDLEWARE_FEATURE_BOOTSTRAP_${Math.random().toString(36).slice(2)}`
    );
    return {
      module: MiddlewareModule,
      providers: [
        {
          provide: featureBootstrap,
          useFactory: (registry: MiddlewareRegistry) => new MiddlewareBootstrap(registry, options),
          inject: [MiddlewareRegistry],
        },
      ],
      exports: [],
    };
  }
}
