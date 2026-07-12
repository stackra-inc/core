/**
 * @file discovery-service.interface.ts
 * @module @stackra/ts-events/core/interfaces
 * @description Discovery Service interface definition for the events package.
 */
export interface IDiscoveryService {
  getProviders(): Array<{ instance: unknown; metatype?: Function | null }>;
}
