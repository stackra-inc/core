/**
 * @file notification.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants for the notification orchestration module.
 */

/**
 * Notification lifecycle events.
 *
 * Emitted by `NotificationService` at dispatch milestones.
 */
export const NOTIFICATION_EVENTS = {
  /** Emitted after a notification is dispatched to all channels. */
  SENT: 'notification.sent',
  /** Emitted when a channel delivery fails. */
  FAILED: 'notification.failed',
  /** Emitted when a notification is queued for async delivery. */
  QUEUED: 'notification.queued',
  /** Emitted when a new channel is registered with the registry. */
  CHANNEL_REGISTERED: 'notification.channel.registered',
} as const;

/** Union of all notification event name strings. */
export type NotificationEventName = (typeof NOTIFICATION_EVENTS)[keyof typeof NOTIFICATION_EVENTS];
