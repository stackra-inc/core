/**
 * @file push.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants for the push notification module.
 */

/**
 * Push notification lifecycle events.
 *
 * Emitted by `PushService` at delivery milestones.
 */
export const PUSH_EVENTS = {
  /** Emitted after a push notification is successfully sent. */
  SENT: 'push.sent',
  /** Emitted when push delivery fails. */
  FAILED: 'push.failed',
  /** Emitted when a push notification is queued for async delivery. */
  QUEUED: 'push.queued',
  /** Emitted after a batch of push notifications is sent. */
  BATCH_SENT: 'push.batch.sent',
  /** Emitted when a device token is detected as expired/invalid. */
  TOKEN_EXPIRED: 'push.token.expired',
  /** Emitted when a new device token is registered. */
  TOKEN_REGISTERED: 'push.token.registered',
  /** Emitted when a device token is unregistered. */
  TOKEN_UNREGISTERED: 'push.token.unregistered',
} as const;

/** Union of all push event name strings. */
export type PushEventName = (typeof PUSH_EVENTS)[keyof typeof PUSH_EVENTS];
