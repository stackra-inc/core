/**
 * Discovery Barrel Export
 *
 * Metadata scanning and provider discovery.
 *
 * @module @stackra/container/discovery
 */

export { DiscoveryService } from './discovery.service';
export { ContainerDiscoveryService } from './container-discovery.service';
export { DiscoveryModule } from './discovery.module';
export { DiscoverableMetaHostCollection } from '../container/discoverable-meta-host-collection.registry';
export type { IDiscoverableDecorator } from '../interfaces/discoverable-decorator.type';
export * from './constants';
export * from './utils';
