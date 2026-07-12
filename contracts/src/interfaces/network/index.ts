/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/network
 * @description Barrel export for network contracts. Re-exports the
 *   bindings interface and the status data shape consumed by every
 *   layer of the `@stackra/network` package.
 */

export type { INetworkBindings } from './network-bindings.interface';
export type { INetworkStatus, NetworkConnectionType } from './network-status.interface';
export type {
  INetworkEventBase,
  INetworkStatusChangedPayload,
  INetworkOnlinePayload,
  INetworkOfflinePayload,
  INetworkConnectionTypeChangedPayload,
} from './network-event-payloads.interface';
