/**
 * @file notification-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/notification
 * @description Typed payloads for notification lifecycle events.
 */

/**
 * Payload for `NOTIFICATION_EVENTS.SENT`.
 */
export interface INotificationSentPayload {
  /** Notification type identifier. */
  readonly type: string;
  /** Number of recipients dispatched to. */
  readonly recipientCount: number;
  /** Channels used for dispatch. */
  readonly channels: string[];
}

/**
 * Payload for `NOTIFICATION_EVENTS.FAILED`.
 */
export interface INotificationFailedPayload {
  /** Notification type identifier. */
  readonly type: string;
  /** Channel that failed. */
  readonly channel: string;
  /** Recipient ID that failed. */
  readonly recipientId: string;
  /** Error message. */
  readonly error: string;
}

/**
 * Payload for `NOTIFICATION_EVENTS.QUEUED`.
 */
export interface INotificationQueuedPayload {
  /** Notification type identifier. */
  readonly type: string;
  /** Channel queued for. */
  readonly channel: string;
  /** Recipient ID. */
  readonly recipientId: string;
}

/**
 * Payload for `NOTIFICATION_EVENTS.CHANNEL_REGISTERED`.
 */
export interface INotificationChannelRegisteredPayload {
  /** Channel name that was registered. */
  readonly channel: string;
}
