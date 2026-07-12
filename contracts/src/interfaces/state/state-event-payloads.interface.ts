/**
 * @file state-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/state
 * @description Typed payloads for state event fragments.
 *
 *   Every `STATE_EVENTS.*` value is a FRAGMENT — the actual channel
 *   is `${storeName}.${fragment}`. Listeners bound via
 *   `@OnEvent('theme.changed')` for a specific store receive one of
 *   these typed payloads. The `IStatePayloadBase` fields identify
 *   which store fired and when.
 *
 *   `STATE_REGISTRY_EVENTS` are package-level events fired directly
 *   from `StateRegistry` (not per-store) — they carry a slim
 *   `{ name }` payload.
 */

/**
 * Common fields carried by every per-store state payload.
 */
export interface IStatePayloadBase {
  /** Store name the event belongs to. */
  readonly store: string;
  /** ISO-8601 timestamp captured at emit time. */
  readonly at: string;
}

/**
 * Payload for `${store}.${STATE_EVENTS.CHANGED}` — the store's state
 * transitioned from `previous` to `state`.
 */
export interface IStateChangedPayload<TState = unknown> extends IStatePayloadBase {
  /** New state value. */
  readonly state: TState;
  /** Previous state value (undefined on the initial hydrate). */
  readonly previous?: TState;
}

/**
 * Payload for `${store}.${STATE_EVENTS.HYDRATED}` — persisted state
 * was restored from the persistence broadcaster at boot.
 */
export interface IStateHydratedPayload<TState = unknown> extends IStatePayloadBase {
  /** Restored state value. */
  readonly state: TState;
}

/**
 * Payload for `${store}.${STATE_EVENTS.SYNC_RECEIVED}` — a cross-tab
 * sync arrived and mutated the store.
 */
export interface IStateSyncReceivedPayload<TState = unknown> extends IStatePayloadBase {
  /** State value received from the sibling tab. */
  readonly state: TState;
}

/**
 * Payload for `${store}.${STATE_EVENTS.REALTIME_RECEIVED}` — a
 * server-pushed update arrived and mutated the store.
 */
export interface IStateRealtimeReceivedPayload<TState = unknown> extends IStatePayloadBase {
  /** State value received from the realtime broadcaster. */
  readonly state: TState;
}

/**
 * Payload for `${store}.${STATE_EVENTS.MUTATE_STARTED}` — a mutation
 * against the store began (`onMutate` in TanStack Query terms).
 */
export interface IStateMutateStartedPayload extends IStatePayloadBase {
  /** Variables the mutation was invoked with. */
  readonly variables?: unknown;
}

/**
 * Payload for `${store}.${STATE_EVENTS.MUTATE_SUCCESS}` — the
 * mutation resolved successfully (`onSuccess`).
 */
export interface IStateMutateSuccessPayload extends IStatePayloadBase {
  /** Result returned by the mutation. */
  readonly result?: unknown;
  /** Variables the mutation was invoked with. */
  readonly variables?: unknown;
}

/**
 * Payload for `${store}.${STATE_EVENTS.MUTATE_FAILED}` — the
 * mutation threw (`onError`).
 */
export interface IStateMutateFailedPayload extends IStatePayloadBase {
  /** Error message from the mutation. */
  readonly error?: string;
  /** Variables the mutation was invoked with. */
  readonly variables?: unknown;
}

/**
 * Payload for `${store}.${STATE_EVENTS.QUERY_STARTED}` — a query
 * against the store began fetching (`onFetch`).
 */
export interface IStateQueryStartedPayload extends IStatePayloadBase {
  /** Query key. */
  readonly key?: unknown;
}

/**
 * Payload for `${store}.${STATE_EVENTS.QUERY_SUCCESS}` — the query
 * returned data.
 */
export interface IStateQuerySuccessPayload extends IStatePayloadBase {
  /** Data returned. */
  readonly data?: unknown;
  /** Query key. */
  readonly key?: unknown;
}

/**
 * Payload for `${store}.${STATE_EVENTS.QUERY_FAILED}` — the query
 * threw.
 */
export interface IStateQueryFailedPayload extends IStatePayloadBase {
  /** Error message from the query. */
  readonly error?: string;
  /** Query key. */
  readonly key?: unknown;
}

// ═════════════════════════════════════════════════════════════════════════
// Registry-level events (not per-store)
// ═════════════════════════════════════════════════════════════════════════

/**
 * Payload for `STATE_REGISTRY_EVENTS.STORE_REGISTERED` — a store
 * was registered with the `StateRegistry`.
 */
export interface IStateRegistryStoreRegisteredPayload {
  /** Store name that was registered. */
  readonly name: string;
}

/**
 * Payload for `STATE_REGISTRY_EVENTS.STORE_REMOVED` — a store was
 * removed from the `StateRegistry`.
 */
export interface IStateRegistryStoreRemovedPayload {
  /** Store name that was removed. */
  readonly name: string;
}
