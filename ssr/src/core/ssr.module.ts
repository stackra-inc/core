/**
 * @file ssr.module.ts
 * @module @stackra/ssr/core
 * @description The composite SSR module — the one consumers import.
 *
 *   `SsrModule.forRoot(...)` bundles the three building-block modules:
 *     - `MiddlewareModule` — the middleware registry + resolver + discovery.
 *     - `ServerModule`     — route registries + renderer + discovery.
 *     - `SeoModule`        — the SEO/AEO metadata service.
 *
 *   A single `forRoot({...})` call wires all three from one options blob.
 *   `forFeature({...})` lets feature modules contribute routes,
 *   middleware, and API routes without re-declaring core services.
 *
 *   Decorator-driven registration works out of the box: any
 *   `@Route()` / `@ApiRoute()` / `@Middleware()` class listed in a
 *   module's `providers` is discovered at `onApplicationBootstrap`.
 */

import { Module, type DynamicModule } from '@stackra/container';
import { SSR_CONFIG } from '@stackra/contracts';

import { MiddlewareModule } from './middleware/middleware.module';
import type { MiddlewareModuleOptions } from './middleware/interfaces/middleware-module-options.interface';
import { ServerModule } from './server/server.module';
import type { SsrModuleOptions } from './server/interfaces/ssr-module-options.interface';
import { mergeConfig } from './server/utils/merge-config.util';
import { SeoModule } from './seo/seo.module';
import type { SeoConfig } from './seo/interfaces/seo-config.interface';

/**
 * App-level options accepted by `SsrModule.forRoot(...)`.
 *
 * `forRoot` configures the application globally — it does **not** register
 * concrete routes or middleware. Route / API-route / middleware
 * registration flows through `SsrModule.forFeature(...)` or the
 * `@Route` / `@ApiRoute` / `@Middleware` decorators (auto-discovered).
 *
 * Fields here are all genuinely app-wide:
 *   - `seo`             — site-wide SEO defaults + base URL.
 *   - `clientEntry` / `clientCss` — SPA-shell asset URLs.
 *   - `globalMiddleware` / `globalGroups` — cross-cutting request
 *     middleware that runs before routing on every request (referenced
 *     by name; the named middleware itself is registered via decorators
 *     or `forFeature`).
 *   - `isCrawler` / `force` / `exposeErrors` / `renderShell` — renderer knobs.
 */
export interface SsrRootOptions extends Omit<SsrModuleOptions, 'routes' | 'apiRoutes'> {
  /** Site-wide SEO defaults. */
  readonly seo?: SeoConfig;
}

/**
 * The composite SSR module.
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     // Root: app-wide config only — no concrete routes/middleware here.
 *     SsrModule.forRoot({
 *       seo: { baseUrl: 'https://acme.com', defaults: { titleTemplate: '%s | Acme' } },
 *       clientEntry: '/src/main.tsx',
 *       clientCss: '/src/styles/index.css',
 *       globalMiddleware: ['logger'], // referenced by name
 *     }),
 *     // Feature: register routes / api routes / middleware.
 *     SsrModule.forFeature({
 *       routes: [homeRoute, dashboardRoute],
 *       apiRoutes: [getCurrentUser],
 *       middleware: [logRequests],
 *       groups: [webGroup, authGroup],
 *     }),
 *   ],
 *   // …or skip forFeature entirely and let these be auto-discovered:
 *   providers: [DashboardRoute, UsersApiRoute, AuthMiddleware],
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
export class SsrModule {
  /**
   * Global registration — imports all three building-block modules and
   * shares a single `SSR_CONFIG` value across them. Registers no
   * concrete routes or middleware; those flow through `forFeature` or
   * decorators.
   */
  public static forRoot(options?: SsrRootOptions): DynamicModule {
    const serverConfig = mergeConfig(options);
    const seoConfig: SeoConfig = options?.seo ?? {};

    return {
      module: SsrModule,
      global: true,
      imports: [
        MiddlewareModule.forRoot(),
        // Server module receives the already-merged config value.
        ServerModule.forRoot(serverConfig),
        SeoModule.forRoot(seoConfig),
      ],
      // Re-export the shared config so feature modules and the renderer
      // resolve the same instance.
      providers: [{ provide: SSR_CONFIG, useValue: serverConfig }],
      exports: [MiddlewareModule, ServerModule, SeoModule, SSR_CONFIG],
    };
  }

  /**
   * Feature registration — contribute routes / API routes / middleware
   * from a feature module. Delegates to the building blocks'
   * `forFeature` where available.
   */
  public static forFeature(options: {
    readonly routes?: SsrModuleOptions['routes'];
    readonly apiRoutes?: SsrModuleOptions['apiRoutes'];
    readonly middleware?: MiddlewareModuleOptions['middleware'];
    readonly groups?: MiddlewareModuleOptions['groups'];
  }): DynamicModule {
    const imports: DynamicModule[] = [];
    if (options.routes || options.apiRoutes) {
      imports.push(
        ServerModule.forFeature({
          routes: options.routes,
          apiRoutes: options.apiRoutes,
        })
      );
    }
    if (options.middleware || options.groups) {
      imports.push(
        MiddlewareModule.forFeature({
          middleware: options.middleware,
          groups: options.groups,
        })
      );
    }
    return {
      module: SsrModule,
      imports,
      exports: [],
    };
  }
}
