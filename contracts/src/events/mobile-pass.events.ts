/**
 * @file mobile-pass.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants for the mobile wallet pass package
 *   (`@stackra/mobile-pass`).
 */

/**
 * Mobile wallet pass lifecycle events.
 *
 * Emitted by `MobilePassService` at pass and device-registration
 * milestones through the shared `EVENT_EMITTER` bus.
 */
export const MOBILE_PASS_EVENTS = {
  /** Emitted after a pass is created and persisted. */
  CREATED: 'mobile-pass.created',
  /** Emitted after a pass is expired / voided. */
  EXPIRED: 'mobile-pass.expired',
  /** Emitted after a pass field value is updated. */
  UPDATED: 'mobile-pass.updated',
  /** Emitted after an Apple device registers for pass push updates. */
  DEVICE_REGISTERED: 'mobile-pass.device.registered',
  /** Emitted after an Apple device unregisters from a pass. */
  DEVICE_UNREGISTERED: 'mobile-pass.device.unregistered',
} as const;

/** Union of all mobile-pass event name strings. */
export type MobilePassEventName = (typeof MOBILE_PASS_EVENTS)[keyof typeof MOBILE_PASS_EVENTS];
