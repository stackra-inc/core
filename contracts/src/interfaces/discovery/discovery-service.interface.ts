/**
 * @file discovery-service.interface.ts
 * @module @stackra/contracts/interfaces/discovery
 * @description Cross-platform discovery service contract.
 */

import type { IDiscoveryProvider } from './discovery-provider.interface';

/**
 * Platform-agnostic service for discovering providers in the DI graph.
 *
 * Inject via `@Inject(DISCOVERY_SERVICE)`.
 */
export interface IDiscoveryService {
  /**
   * Get all providers registered in the container.
   *
   * @returns Array of all resolved class-based providers
   */
  getProviders(): IDiscoveryProvider[];

  /**
   * Get providers whose class is decorated with a specific metadata key.
   *
   * @param key - The metadata key to filter by (string or symbol)
   * @returns Array of providers where the metadata value is defined
   */
  getProvidersByMetadata(key: string | symbol): IDiscoveryProvider[];
}
