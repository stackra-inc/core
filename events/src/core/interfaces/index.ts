/**
 * @file index.ts
 * @module @stackra/ts-events/core/interfaces
 * @description Barrel export for events core interfaces.
 */
export type { IDiscoveryService } from './discovery-service.interface';
export type { IEventEmitterConfig } from './event-emitter-config.interface';
export type { IEventTransportOptions, IEventTransport } from './event-transport-options.interface';
export type { IListenerEntry, EventListener } from './listener-entry.interface';
export type { IOnEventMetadata, IOnEventOptions } from './on-event-metadata.interface';
export type { IEventSubscriberMap } from './event-subscriber-map.type';
