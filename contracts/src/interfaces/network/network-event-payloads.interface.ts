/**
 * @file network-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/network
 * @description Typed payloads for every constant in `NETWORK_EVENTS`.
 *
 *   Every payload carries the full {@link INetworkStatus} snapshot
 *   at the moment the event fired, plus the previous snapshot for
 *   deltas.
 */

import type { INetworkStatus, NetworkConnectionType } from './network-status.interface';

/**
 * Common fields carried by every network lifecycle payload.
 */
export interface INetworkEventBase {
  /** Current status snapshot. */
  readonly status: INetworkStatus;
  /** Previous status snapshot (undefined for the very first sample). */
  readonly previous?: INetworkStatus;
}

/**
 * Payload for `NETWORK_EVENTS.STATUS_CHANGED` — fired on every
 * sample from the platform bindings.
 */
export interface INetworkStatusChangedPayload extends INetworkEventBase {}

/**
 * Payload for `NETWORK_EVENTS.ONLINE` — the device transitioned
 * from offline to online.
 */
export interface INetworkOnlinePayload extends INetworkEventBase {}

/**
 * Payload for `NETWORK_EVENTS.OFFLINE` — the device transitioned
 * from online to offline.
 */
export interface INetworkOfflinePayload extends INetworkEventBase {}

/**
 * Payload for `NETWORK_EVENTS.CONNECTION_TYPE_CHANGED` — connection
 * type (wifi/cellular/ethernet/unknown) changed while online.
 */
export interface INetworkConnectionTypeChangedPayload {
  /** New connection type. */
  readonly type: NetworkConnectionType;
  /** Previous connection type. */
  readonly previousType: NetworkConnectionType;
  /** Current status snapshot. */
  readonly status: INetworkStatus;
}
