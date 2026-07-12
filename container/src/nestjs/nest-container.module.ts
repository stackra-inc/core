/**
 * @file nest-container.module.ts
 * @module @stackra/nestjs-container
 * @description NestJS container integration module.
 *   Registers `NestDiscoveryService` under the `DISCOVERY_SERVICE` token
 *   from `@stackra/contracts`, enabling platform-agnostic auto-discovery
 *   of decorated providers (reporters, processors, listeners, etc.)
 *   across all NestJS modules.
 *
 *   Import once at the root via `NestContainerModule.forRoot()` — the module
 *   is global, so DISCOVERY_SERVICE is available to all providers.
 *
 * @example
 * ```typescript
 * import { NestContainerModule } from '@stackra/container';
 *
 * @Module({
 *   imports: [NestContainerModule.forRoot()],
 * })
 * export class AppModule {}
 * ```
 */

import { Module, type DynamicModule } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { DISCOVERY_SERVICE } from '@stackra/contracts';

import { NestDiscoveryService } from './services/nest-discovery.service';

/**
 * NestJS container module.
 *
 * Provides the `NestDiscoveryService` (implementing `IDiscoveryService`) and
 * binds it to the `DISCOVERY_SERVICE` token. Any loader service that injects
 * `@Inject(DISCOVERY_SERVICE)` will receive the NestJS-powered discovery
 * implementation.
 *
 * Features:
 * - Global module (available to all providers without explicit import)
 * - Imports NestJS `DiscoveryModule` for provider scanning
 * - Registers `NestDiscoveryService` under `DISCOVERY_SERVICE` token
 * - Exports both the token and the concrete service
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     NestContainerModule.forRoot(),
 *     LoggerModule.forRoot({ ... }),
 *     // ReporterLoader will now use NestDiscoveryService automatically
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
export class NestContainerModule {
  /**
   * Register the NestJS container module globally.
   *
   * Imports `DiscoveryModule` from `@nestjs/core` and provides
   * `NestDiscoveryService` as the `DISCOVERY_SERVICE` implementation.
   *
   * @returns Dynamic module definition
   */
  public static forRoot(): DynamicModule {
    return {
      module: NestContainerModule,
      global: true,
      imports: [DiscoveryModule],
      providers: [
        NestDiscoveryService,
        { provide: DISCOVERY_SERVICE, useExisting: NestDiscoveryService },
      ],
      exports: [DISCOVERY_SERVICE, NestDiscoveryService],
    };
  }
}
