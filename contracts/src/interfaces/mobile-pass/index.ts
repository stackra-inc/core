/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/mobile-pass
 * @description Barrel for mobile wallet pass contracts.
 */

export type {
  IAppleWebserviceConfig,
  IApplePassConfig,
  IGooglePassConfig,
  IMobilePassQueueConfig,
  IMobilePassBuildersConfig,
  IMobilePassModuleOptions,
} from './mobile-pass-module-options.interface';

export type {
  IMobilePassModelRef,
  IMobilePassCreateOptions,
  IMobilePassFieldUpdateOptions,
  IMobilePassRecord,
  IMobilePassService,
} from './mobile-pass-service.interface';

export type {
  IMobilePassCreatedPayload,
  IMobilePassExpiredPayload,
  IMobilePassUpdatedPayload,
  IMobilePassDeviceRegisteredPayload,
  IMobilePassDeviceUnregisteredPayload,
} from './mobile-pass-event-payloads.interface';
