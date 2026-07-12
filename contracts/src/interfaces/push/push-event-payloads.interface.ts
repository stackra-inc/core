/**
 * @file push-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/push
 * @description Typed payloads for push notification lifecycle events.
 */

/**
 * Payload for `PUSH_EVENTS.SENT`.
 */
export interface IPushSentPayload {
  /** Provider driver used (fcm, apns, expo, web-push). */
  readonly provider: string;
  /** Message ID returned by the provider. */
  readonly messageId?: string;
  /** Device token the notification was sent to. */
  readonly token: string;
}

/**
 * Payload for `PUSH_EVENTS.FAILED`.
 */
export interface IPushFailedPayload {
  /** Provider driver used. */
  readonly provider: string;
  /** Error message from the provider. */
  readonly error: string;
  /** Device token targeted. */
  readonly token: string;
  /** Whether the failure is permanent. */
  readonly permanent?: boolean;
}

/**
 * Payload for `PUSH_EVENTS.QUEUED`.
 */
export interface IPushQueuedPayload {
  /** Queue job ID. */
  readonly jobId: string;
  /** Number of tokens in the batch. */
  readonly tokenCount: number;
  /** Provider to be used for delivery. */
  readonly provider: string;
}

/**
 * Payload for `PUSH_EVENTS.BATCH_SENT`.
 */
export interface IPushBatchSentPayload {
  /** Provider driver used. */
  readonly provider: string;
  /** Total messages in the batch. */
  readonly total: number;
  /** Successful deliveries. */
  readonly successCount: number;
  /** Failed deliveries. */
  readonly failureCount: number;
  /** Tokens detected as expired. */
  readonly expiredTokenCount: number;
}

/**
 * Payload for `PUSH_EVENTS.TOKEN_EXPIRED`.
 */
export interface IPushTokenExpiredPayload {
  /** The expired device token. */
  readonly token: string;
  /** Provider that reported the expiry. */
  readonly provider: string;
  /** User ID the token belonged to (if known). */
  readonly userId?: string;
}

/**
 * Payload for `PUSH_EVENTS.TOKEN_REGISTERED`.
 */
export interface IPushTokenRegisteredPayload {
  /** The registered device token. */
  readonly token: string;
  /** Platform (ios, android, web). */
  readonly platform: string;
  /** Provider (fcm, apns, expo). */
  readonly provider: string;
  /** User ID the token belongs to. */
  readonly userId: string;
}

/**
 * Payload for `PUSH_EVENTS.TOKEN_UNREGISTERED`.
 */
export interface IPushTokenUnregisteredPayload {
  /** The unregistered device token. */
  readonly token: string;
  /** User ID the token belonged to. */
  readonly userId: string;
}
