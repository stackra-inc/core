/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/preferences
 * @description Barrel for the `@stackra/preferences` cross-package
 *   contracts.
 */

export type { IPreferencesStore } from './preferences-store.interface';
export type {
  IPreferencesManager,
  PreferencesStoreCreator,
} from './preferences-manager.interface';
export type {
  IPreferencesEventBase,
  IPreferencesValueChangedPayload,
  IPreferencesValueRemovedPayload,
  IPreferencesStoreRegisteredPayload,
} from './preferences-event-payloads.interface';
