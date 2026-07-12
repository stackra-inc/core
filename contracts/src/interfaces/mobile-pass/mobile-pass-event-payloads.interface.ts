/**
 * @file mobile-pass-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/mobile-pass
 * @description Typed payloads for `MOBILE_PASS_EVENTS`.
 *
 *   Consumers using `@OnEvent(MOBILE_PASS_EVENTS.*)` import the matching
 *   payload interface so their listener signatures are compile-time
 *   checked.
 */

/**
 * Payload for `MOBILE_PASS_EVENTS.CREATED`.
 */
export interface IMobilePassCreatedPayload {
  /** Serial number of the created pass. */
  readonly passSerial: string;
  /** Target platform (`'apple'` | `'google'`). */
  readonly platform: string;
}

/**
 * Payload for `MOBILE_PASS_EVENTS.EXPIRED`.
 */
export interface IMobilePassExpiredPayload {
  /** Serial number of the expired pass. */
  readonly passSerial: string;
  /** Target platform (`'apple'` | `'google'`). */
  readonly platform: string;
}

/**
 * Payload for `MOBILE_PASS_EVENTS.UPDATED`.
 */
export interface IMobilePassUpdatedPayload {
  /** Serial number of the updated pass. */
  readonly passSerial: string;
  /** Field key that changed. */
  readonly fieldKey: string;
  /** New field value. */
  readonly value: string;
}

/**
 * Payload for `MOBILE_PASS_EVENTS.DEVICE_REGISTERED`.
 */
export interface IMobilePassDeviceRegisteredPayload {
  /** Device library identifier provided by Apple. */
  readonly deviceId: string;
  /** Serial number of the pass the device registered for. */
  readonly passSerial: string;
  /** Apple pass type identifier. */
  readonly passTypeId: string;
}

/**
 * Payload for `MOBILE_PASS_EVENTS.DEVICE_UNREGISTERED`.
 */
export interface IMobilePassDeviceUnregisteredPayload {
  /** Device library identifier provided by Apple. */
  readonly deviceId: string;
  /** Serial number of the pass the device unregistered from. */
  readonly passSerial: string;
  /** Apple pass type identifier. */
  readonly passTypeId: string;
}
