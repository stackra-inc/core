/**
 * @file nest-discovery.service.ts
 * @module @stackra/nestjs-container/services
 * @description NestJS implementation of IDiscoveryService from @stackra/contracts.
 *   Wraps @nestjs/core's DiscoveryService to provide platform-agnostic
 *   provider scanning by metadata key. This enables loader services
 *   (ReporterLoader, CacheStoreLoader, ProcessorLoader, etc.) to work
 *   identically in NestJS without any platform-specific code.
 */

import { Injectable } from '@nestjs/common';
import { DiscoveryService as NestCoreDiscoveryService } from '@nestjs/core';
import { getMetadata } from '@vivtel/metadata';
import type { IDiscoveryProvider, IDiscoveryService } from '@stackra/contracts';

/**
 * NestJS implementation of the cross-package IDiscoveryService contract.
 *
 * Delegates to @nestjs/core's `DiscoveryService` to scan all providers
 * registered in the NestJS module graph, then normalizes results into
 * the `IDiscoveryProvider` shape that loader services expect.
 *
 * Features:
 * - Scans ALL providers across ALL modules (global discovery)
 * - Filters by `@vivtel/metadata` keys (same as ts-container)
 * - Returns normalized IDiscoveryProvider wrappers
 * - Skips providers without live instances or class metatypes
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ReporterLoader implements OnModuleInit {
 *   constructor(
 *     @Inject(DISCOVERY_SERVICE) private readonly discovery: IDiscoveryService,
 *   ) {}
 *
 *   onModuleInit(): void {
 *     const reporters = this.discovery.getProvidersByMetadata(REPORTER_METADATA_KEY);
 *     for (const { instance } of reporters) {
 *       this.manager.registerReporter(instance);
 *     }
 *   }
 * }
 * ```
 */
@Injectable()
export class NestDiscoveryService implements IDiscoveryService {
  /**
   * @param discoveryService - NestJS core DiscoveryService for provider scanning
   */
  public constructor(private readonly discoveryService: NestCoreDiscoveryService) {}

  /**
   * Get all providers registered in the NestJS module graph.
   *
   * Scans all modules and returns class-based providers that have been
   * instantiated. Value providers and factory providers without a metatype
   * are excluded.
   *
   * @returns Array of all class-based providers with live instances
   */
  public getProviders(): IDiscoveryProvider[] {
    const wrappers = this.discoveryService.getProviders();
    const result: IDiscoveryProvider[] = [];

    for (const wrapper of wrappers) {
      const instance = wrapper.instance;
      const metatype = wrapper.metatype ?? null;

      // Skip unresolved or non-class providers
      if (!instance || !metatype) continue;

      result.push({
        instance,
        metatype,
        name: metatype.name ?? 'unknown',
        token: wrapper.token,
      });
    }

    return result;
  }

  /**
   * Get providers whose metatype is decorated with a specific metadata key.
   *
   * Iterates all providers and checks each metatype for the given metadata
   * key using `@vivtel/metadata`'s `getMetadata`. Returns only providers
   * where the metadata value is defined and non-null.
   *
   * @param key - The metadata key to filter by (string or symbol)
   * @returns Array of matching providers with their metadata values
   */
  public getProvidersByMetadata(key: string | symbol): IDiscoveryProvider[] {
    const allProviders = this.getProviders();

    return allProviders.filter((provider) => {
      if (!provider.metatype) return false;
      const meta = getMetadata(key, provider.metatype);
      return meta !== undefined && meta !== null;
    });
  }
}
