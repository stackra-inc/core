/**
 * @file container-discovery.service.ts
 * @module @stackra/container/services
 * @description Platform-agnostic IDiscoveryService implementation for ts-container.
 *   Wraps the internal DiscoveryService to implement the cross-package
 *   IDiscoveryService contract from @stackra/contracts. This allows any loader
 *   service (ReporterLoader, CacheStoreLoader, etc.) to inject DISCOVERY_SERVICE
 *   and discover decorated providers without coupling to ts-container internals.
 */

import { getMetadata } from '@vivtel/metadata';
import type { IDiscoveryProvider, IDiscoveryService } from '@stackra/contracts';

import { Injectable } from '@/core/decorators/injectable.decorator';
import { DiscoveryService } from './discovery.service';
import { InstanceWrapper } from '@/core/container/instance-wrapper';

/**
 * ts-container implementation of the cross-package IDiscoveryService contract.
 *
 * Delegates to the internal DiscoveryService (which handles both ts-container's
 * native module graph and the NestJS bridge) and normalizes results into
 * the IDiscoveryProvider shape that loader services expect.
 *
 * Registered globally by DiscoveryModule and bound to the DISCOVERY_SERVICE token,
 * making it available to any package that injects `@Inject(DISCOVERY_SERVICE)`.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ReporterLoader {
 *   constructor(
 *     @Inject(DISCOVERY_SERVICE) private readonly discovery: IDiscoveryService,
 *   ) {}
 *
 *   onModuleInit(): void {
 *     const reporters = this.discovery.getProvidersByMetadata(REPORTER_METADATA_KEY);
 *     // ... register each reporter
 *   }
 * }
 * ```
 */
@Injectable()
export class ContainerDiscoveryService implements IDiscoveryService {
  /**
   * @param discoveryService - The internal ts-container DiscoveryService
   */
  public constructor(private readonly discoveryService: DiscoveryService) {}

  /**
   * Get all providers registered in the current module graph.
   *
   * Scans the ts-container module graph (or the NestJS bridge if active)
   * and returns all class-based providers normalized as IDiscoveryProvider.
   *
   * @returns Array of all providers with live instances
   */
  public getProviders(): IDiscoveryProvider[] {
    const wrappers = this.discoveryService.getProviders();
    return this.wrapProviders(wrappers);
  }

  /**
   * Get providers whose metatype has a specific metadata key.
   *
   * Iterates all providers and checks each metatype for the given metadata
   * key using `@vivtel/metadata`'s `getMetadata`. Returns only providers
   * where the metadata value is truthy.
   *
   * @param key - The metadata key to filter by (string or symbol)
   * @returns Array of matching providers
   */
  public getProvidersByMetadata(key: string | symbol): IDiscoveryProvider[] {
    const allProviders = this.getProviders();

    return allProviders.filter((provider) => {
      if (!provider.metatype) return false;
      const meta = getMetadata(key, provider.metatype);
      return meta !== undefined && meta !== null;
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Private Helpers
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Normalize InstanceWrapper[] into IDiscoveryProvider[].
   *
   * Filters out wrappers without live instances (unresolved providers)
   * and maps each to the uniform IDiscoveryProvider shape.
   *
   * @param wrappers - Raw instance wrappers from the container
   * @returns Normalized discovery providers
   */
  private wrapProviders(wrappers: InstanceWrapper[]): IDiscoveryProvider[] {
    const result: IDiscoveryProvider[] = [];

    for (const wrapper of wrappers) {
      const instance = wrapper.instance;
      const metatype = wrapper.metatype ?? null;

      // Skip unresolved or non-class providers
      if (!instance) continue;

      result.push({
        instance,
        metatype,
        name: wrapper.name ?? metatype?.name ?? 'unknown',
        token: wrapper.token,
      });
    }

    return result;
  }
}
