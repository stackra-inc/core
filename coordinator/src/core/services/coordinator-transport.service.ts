/**
 * @file coordinator-transport.service.ts
 * @module @stackra/coordinator/core/services
 * @description Cross-tab event relay transport for `@stackra/events`.
 *   Implements `IEventTransport` — relays events matching configured patterns
 *   to all other browser tabs via BroadcastChannel.
 *
 *   Register with `@EventTransport({ name: 'cross-tab' })` for auto-discovery,
 *   or register manually via `EventTransportRegistry`.
 */

import { Injectable, Inject, Optional } from '@stackra/container';
import { COORDINATOR_CONFIG } from '../constants';
import type { ICoordinatorModuleOptions } from '../interfaces';
import type { IEventEmitterSync } from '@stackra/contracts';
import type { IRelayMessage } from '../interfaces/relay-message.interface';

// ════════════════════════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════════════════════════

/** Minimal emitter interface (avoids hard dep on @stackra/events). */

/** Message shape for cross-tab event relay. */

// ════════════════════════════════════════════════════════════════════════════════
// Implementation
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Cross-tab event relay transport.
 *
 * When connected to the EventEmitter, subscribes to all events matching
 * the configured patterns and relays them to other tabs via BroadcastChannel.
 * Incoming relayed events are re-emitted on the local EventEmitter.
 *
 * @example
 * ```typescript
 * // Events matching 'auth.**' or 'sync.**' are relayed to all tabs.
 * // Tab A emits 'auth.logout' → Tab B/C/D receive it locally.
 * ```
 */
@Injectable()
export class CoordinatorTransport {
  /** BroadcastChannel for cross-tab event relay. */
  private channel: BroadcastChannel | null = null;

  /** The connected emitter instance. */
  private emitter: IEventEmitterSync | null = null;

  /** Unique tab ID to prevent echo (don't re-emit own events). */
  private readonly tabId: string;

  /** Patterns to match for relay. */
  private readonly patterns: string[];

  /** Delimiter for pattern matching. */
  private readonly delimiter = '.';

  /** Whether broadcasting is enabled. */
  private readonly enabled: boolean;

  /**
   * @param config - Module configuration
   */
  public constructor(@Optional() @Inject(COORDINATOR_CONFIG) config?: ICoordinatorModuleOptions) {
    this.tabId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    this.patterns = config?.broadcastPatterns ?? ['sync:**', 'auth:**', 'state:**'];
    this.enabled = config?.broadcastEvents ?? true;
  }

  /**
   * Connect the transport to an EventEmitter.
   *
   * Called by EventSubscribersLoader at bootstrap (if decorated with
   * `@EventTransport`) or manually.
   *
   * @param emitter - The application's EventEmitter
   */
  public connect(emitter: IEventEmitterSync): void {
    if (!this.enabled) return;
    if (typeof BroadcastChannel === 'undefined') return;

    this.emitter = emitter;
    const channelName = 'stackra-event-relay';
    this.channel = new BroadcastChannel(channelName);

    // Listen for incoming relayed events from other tabs
    this.channel.onmessage = (event: MessageEvent) => {
      const msg = event.data as IRelayMessage;
      if (msg.kind !== 'event-relay') return;
      if (msg.sourceTabId === this.tabId) return; // Don't echo own events
      // Re-emit on the local emitter
      this.emitter?.emit(msg.event, ...msg.args);
    };
  }

  /**
   * Disconnect the transport and release resources.
   */
  public disconnect(): void {
    this.channel?.close();
    this.channel = null;
    this.emitter = null;
  }

  /**
   * Relay an event to other tabs (called when a matching event is emitted locally).
   *
   * @param event - Event name
   * @param args - Event arguments
   */
  public relay(event: string, ...args: unknown[]): void {
    if (!this.channel) return;
    if (!this.matchesPatterns(event)) return;

    const msg: IRelayMessage = {
      kind: 'event-relay',
      event,
      args,
      sourceTabId: this.tabId,
    };

    try {
      this.channel.postMessage(msg);
    } catch {
      // Channel closed or serialization error
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Private — Pattern Matching
  // ══════════════════════════════════════════════════════════════════════════════

  /** Check if an event matches any of the configured patterns. */
  private matchesPatterns(event: string): boolean {
    return this.patterns.some((pattern) => this.matchWildcard(pattern, event));
  }

  /** Wildcard pattern match (* = one segment, ** = one or more). */
  private matchWildcard(pattern: string, event: string): boolean {
    const pp = pattern.split(this.delimiter);
    const ep = event.split(this.delimiter);
    return this.matchParts(pp, 0, ep, 0);
  }

  private matchParts(pattern: string[], pi: number, event: string[], ei: number): boolean {
    if (pi === pattern.length && ei === event.length) return true;
    if (pi === pattern.length) return false;
    const seg = pattern[pi];
    if (seg === '**') {
      for (let skip = 1; skip <= event.length - ei; skip++) {
        if (this.matchParts(pattern, pi + 1, event, ei + skip)) return true;
      }
      return false;
    }
    if (ei === event.length) return false;
    if (seg === '*') return this.matchParts(pattern, pi + 1, event, ei + 1);
    if (seg === event[ei]) return this.matchParts(pattern, pi + 1, event, ei + 1);
    return false;
  }
}
