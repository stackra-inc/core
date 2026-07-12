/**
 * @file pubsub-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/pubsub
 * @description Typed payloads for every constant in `PUBSUB_EVENTS`.
 */

/**
 * Payload for `PUBSUB_EVENTS.PUBLISHED` — a message was pushed to
 * the driver.
 */
export interface IPubsubPublishedPayload {
  /** Channel name. */
  readonly channel: string;
  /** UNIX epoch milliseconds when the publish happened. */
  readonly timestamp: number;
}

/**
 * Payload for `PUBSUB_EVENTS.SUBSCRIBED` — a subscription was
 * opened on the driver.
 */
export interface IPubsubSubscribedPayload {
  /** Channel name (or wildcard pattern for psubscribe). */
  readonly channel: string;
}

/**
 * Payload for `PUBSUB_EVENTS.UNSUBSCRIBED` — a subscription was
 * closed.
 */
export interface IPubsubUnsubscribedPayload {
  readonly channel: string;
}

/**
 * Payload for `PUBSUB_EVENTS.MESSAGE_RECEIVED` — the transport
 * decoded a frame and delivered it to a subscriber callback. Fires
 * BEFORE the caller's handler runs so audit / metrics consumers see
 * every inbound frame.
 */
export interface IPubsubMessageReceivedPayload {
  /** Channel the frame was routed on. */
  readonly channel: string;
  /** Event name inside the frame. */
  readonly event: string;
  /** Decoded payload. */
  readonly data: unknown;
  /** UNIX epoch milliseconds when the frame was received. */
  readonly timestamp: number;
}
