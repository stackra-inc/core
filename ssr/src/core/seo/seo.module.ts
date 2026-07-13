/**
 * @file seo.module.ts
 * @module @stackra/ssr/core/seo
 * @description DI module for SEO / AEO metadata.
 *
 *   Registers `SeoService` and the site-wide `SEO_CONFIG`. The service
 *   is a pure transformer — it holds no mutable route state, so there's
 *   no discovery or bootstrap here. Route SEO descriptors live on route
 *   `handle.seo` and are collected per-request by the renderer (server)
 *   or `<Meta>` (client).
 *
 *   `SeoModule` is bundled by the composite `SsrModule`; it is also
 *   exported standalone for apps that want structured metadata without
 *   the full routing runtime.
 */

import { Module, type DynamicModule } from '@stackra/container';
import type { IAsyncModuleOptions } from '@stackra/contracts';
import { SEO_CONFIG, SEO_SERVICE } from '@stackra/contracts';

import type { SeoConfig } from './interfaces/seo-config.interface';
import { SeoService } from './services/seo.service';
import { DEFAULT_SEO_CONFIG } from './constants/default-seo-config.constant';

/**
 * The SEO DI module.
 */
@Module({})
export class SeoModule {
  /**
   * Register `SeoService` with site-wide defaults.
   *
   * When `config` is provided it is registered under `SEO_CONFIG`.
   * The composite `SsrModule` passes its resolved config so the value
   * is registered exactly once.
   */
  public static forRoot(config?: SeoConfig): DynamicModule {
    const resolved: SeoConfig = { ...DEFAULT_SEO_CONFIG, ...(config ?? {}) };
    return {
      module: SeoModule,
      global: true,
      providers: [
        { provide: SEO_CONFIG, useValue: resolved },
        SeoService,
        { provide: SEO_SERVICE, useExisting: SeoService },
      ],
      exports: [SEO_CONFIG, SeoService, SEO_SERVICE],
    };
  }

  /**
   * Async factory variant.
   */
  public static forRootAsync(options: IAsyncModuleOptions<SeoConfig>): DynamicModule {
    return {
      module: SeoModule,
      global: true,
      imports: options.imports ?? [],
      providers: [
        {
          provide: SEO_CONFIG,
          useFactory: async (...args: unknown[]) => ({
            ...DEFAULT_SEO_CONFIG,
            ...(await options.useFactory(...args)),
          }),
          inject: options.inject ?? [],
        },
        SeoService,
        { provide: SEO_SERVICE, useExisting: SeoService },
      ],
      exports: [SEO_CONFIG, SeoService, SEO_SERVICE],
    };
  }
}
