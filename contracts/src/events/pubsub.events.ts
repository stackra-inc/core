/**
 * @file pubsub.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by `@stackra/pubsub`.
 *
 *   Emitted by `PubSubService` on the optional `EVENT_EMITTER` bus
 *   whenever a message is published, a subscription is opened, or a
 *   subscription is closed. The driver itself emits transport-level
 *   `MESSAGE_RECEIVED` events when raw frames arrive.
 *
 *   @example
 *   ```typescript
 *   import { PUBSUB_EVENTS } from '@stackra/contracts';
 *
 *   @OnEvent(PUBSUB_EVENTS.PUBLISHED)
 *   onPublish(payload: { channel: string }) {
 *     metrics.increment('pubsub.publish', { channel: payload.channel });
 *   }
 *   ```
 */

/**
 * Pub/Sub lifecycle event names.
 *
 * Payload shapes:
 * - `PUBLISHED`        — `{ channel, timestamp }`
 * - `SUBSCRIBED`       — `{ channel }`
 * - `UNSUBSCRIBED`     — `{ channel }`
 * - `MESSAGE_RECEIVED` — `{ channel, event, data, timestamp }`
 */
export const PUBSUB_EVENTS = {
  /** A message was published to a channel. */
  PUBLISHED: 'pubsub.published',
  /** A subscription was opened on a channel. */
  SUBSCRIBED: 'pubsub.subscribed',
  /** A subscription was closed. */
  UNSUBSCRIBED: 'pubsub.unsubscribed',
  /** A message was received on a subscribed channel. */
  MESSAGE_RECEIVED: 'pubsub.message.received',
} as const;

/** Union type of every emitted pubsub event name. */
export type PubsubEventName = (typeof PUBSUB_EVENTS)[keyof typeof PUBSUB_EVENTS];
