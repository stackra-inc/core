/**
 * @file realtime-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/realtime
 * @description Typed payloads for every constant in `REALTIME_EVENTS`.
 */

/**
 * Common fields carried by every realtime lifecycle payload.
 */
export interface IRealtimeEventBase {
  /** Named connection that produced the event. */
  readonly connection: string;
}

/**
 * Payload for `REALTIME_EVENTS.CONNECTED` — a connection completed
 * its handshake.
 */
export interface IRealtimeConnectedPayload extends IRealtimeEventBase {}

/**
 * Payload for `REALTIME_EVENTS.DISCONNECTED` — a connection was
 * closed (manual, network drop, or server-side close).
 */
export interface IRealtimeDisconnectedPayload extends IRealtimeEventBase {
  /** Reason string surfaced by the driver (`manual`, `network`, …). */
  readonly reason: string;
}

/**
 * Payload for `REALTIME_EVENTS.RECONNECTING` — the driver's
 * reconnect loop is currently in flight.
 */
export interface IRealtimeReconnectingPayload extends IRealtimeEventBase {
  /** 1-based reconnect attempt counter. */
  readonly attempt: number;
}

/**
 * Payload for `REALTIME_EVENTS.ERROR` — the transport surfaced a
 * recoverable error.
 */
export interface IRealtimeErrorPayload extends IRealtimeEventBase {
  /** Human-readable error message. */
  readonly error: string;
}

/**
 * Payload for `REALTIME_EVENTS.MESSAGE` — a message arrived on a
 * subscribed channel.
 */
export interface IRealtimeMessagePayload extends IRealtimeEventBase {
  /** Channel the frame was routed on. */
  readonly channel: string;
  /** Event name inside the frame. */
  readonly event: string;
  /** Decoded payload. */
  readonly data: unknown;
}
