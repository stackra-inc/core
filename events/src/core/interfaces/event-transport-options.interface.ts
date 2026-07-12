/**
 * @file event-transport-options.interface.ts
 * @module @stackra/events/core/interfaces
 * @description Options for the `@EventTransport()` class decorator.
 *   Transports are external event sources (WebSocket, SSE, BroadcastChannel)
 *   that inject events into the local EventEmitter.
 */

import type { IEventEmitterSync } from '@stackra/contracts';

// ════════════════════════════════════════════════════════════════════════════════
// Interfaces
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Options passed to the `@EventTransport()` class decorator.
 */
export interface IEventTransportOptions {
  /**
   * Unique name for this transport (used by the registry for lookup).
   *
   * @example 'websocket', 'broadcast-channel', 'sse'
   */
  name: string;
}

/**
 * Contract that transport classes must implement.
 *
 * At bootstrap, the `EventSubscribersLoader` calls `connect(emitter)`
 * on each discovered transport. The transport then listens to its
 * external source and re-emits events on the provided emitter.
 *
 * On shutdown, `disconnect()` is called to clean up resources.
 */
export interface IEventTransport {
  /**
   * Connect the transport to the event emitter.
   *
   * Called once at application bootstrap. The transport should start
   * listening to its external source and forward events to the emitter.
   *
   * @param emitter - The application's EventEmitter instance
   */
  connect(emitter: IEventEmitterSync): void;

  /**
   * Disconnect the transport and release resources.
   *
   * Called on application shutdown. Close sockets, clear intervals, etc.
   */
  disconnect(): void;
}
