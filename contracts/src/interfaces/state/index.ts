/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/state
 * @description Barrel for state event payload types.
 */
export type {
  IStatePayloadBase,
  IStateChangedPayload,
  IStateHydratedPayload,
  IStateSyncReceivedPayload,
  IStateRealtimeReceivedPayload,
  IStateMutateStartedPayload,
  IStateMutateSuccessPayload,
  IStateMutateFailedPayload,
  IStateQueryStartedPayload,
  IStateQuerySuccessPayload,
  IStateQueryFailedPayload,
  IStateRegistryStoreRegisteredPayload,
  IStateRegistryStoreRemovedPayload,
} from './state-event-payloads.interface';
