/**
 * @file tab-coordinator.service.ts
 * @module @stackra/coordinator/core/services
 * @description Leader election and tab awareness across browser tabs.
 *   Uses Web Locks API for race-free election (primary) with BroadcastChannel
 *   heartbeat protocol as fallback. Tracks active tabs, emits role changes,
 *   and provides instant failover on tab close.
 *
 *   Other packages consume this to ensure only one tab performs expensive
 *   operations (WebSocket connection, sync, queue draining, token refresh).
 */

import { Injectable, Inject, Optional } from '@stackra/container';
import { COORDINATOR_CONFIG } from '@/core/constants';
import { COORDINATOR_EVENTS } from '@/core/constants';
import type { ICoordinatorModuleOptions } from '@/core/interfaces';
import type { ITabInfo } from '@/core/interfaces';
import type { TabRole, CoordinatorMessage, RoleListener } from '@/core/types';
import { CoordinatorMessageKind } from '@/core/enums';
import { EVENT_EMITTER } from '@stackra/contracts';
import type { IEventEmitterSync } from '@stackra/contracts';

// ════════════════════════════════════════════════════════════════════════════════
// Types
// ════════════════════════════════════════════════════════════════════════════════

/** Minimal event emitter interface (optional peer: @stackra/events). */

/** DI token for the optional event emitter. */
// ════════════════════════════════════════════════════════════════════════════════
// Implementation
// ════════════════════════════════════════════════════════════════════════════════

/**
 * TabCoordinator — leader election and cross-tab awareness.
 *
 * Responsibilities:
 * - Elect a single leader tab from all open tabs
 * - Detect leader failure via heartbeat timeout (or Web Locks release)
 * - Track active tabs (census)
 * - Notify subscribers on role changes
 * - Optionally prefer the visible/focused tab as leader
 *
 * @example
 * ```typescript
 * const coordinator = container.get(TabCoordinator);
 *
 * coordinator.onRoleChange((role) => {
 *   if (role === 'leader') startAutoSync();
 *   else stopAutoSync();
 * });
 *
 * if (coordinator.isLeader()) {
 *   await performExpensiveOperation();
 * }
 * ```
 */
@Injectable()
export class TabCoordinator {
  /** Unique identifier for this tab instance. */
  private readonly tabId: string;

  /** BroadcastChannel for inter-tab communication. */
  private channel: BroadcastChannel | null = null;

  /** Current leader tab ID, or null if unknown. */
  private leaderId: string | null = null;

  /** Last heartbeat timestamp from the leader. */
  private lastHeartbeatAt: number = 0;

  /** Heartbeat timer (active when leader). */
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  /** Stale check timer (active when follower). */
  private staleCheckTimer: ReturnType<typeof setInterval> | null = null;

  /** Known tabs with last-seen timestamps. */
  private readonly knownTabs: Map<string, number> = new Map();

  /** Current role. */
  private currentRole: TabRole = 'follower';

  /** Role change listeners. */
  private readonly roleListeners: Set<RoleListener> = new Set();

  /** Whether destroyed. */
  private destroyed = false;

  /** Resolved configuration. */
  private readonly config: Required<
    Pick<
      ICoordinatorModuleOptions,
      | 'channelName'
      | 'heartbeatMs'
      | 'staleThresholdMs'
      | 'preferWebLocksElection'
      | 'preferVisibleLeader'
    >
  >;

  /**
   * @param options - Module configuration (optional)
   * @param eventEmitter - Optional event emitter for lifecycle events
   */
  public constructor(
    @Optional() @Inject(COORDINATOR_CONFIG) options?: ICoordinatorModuleOptions,
    @Optional() @Inject(EVENT_EMITTER) private readonly eventEmitter?: IEventEmitterSync
  ) {
    this.tabId = this.generateTabId();
    this.config = {
      channelName: options?.channelName ?? 'stackra-coordinator',
      heartbeatMs: options?.heartbeatMs ?? 1000,
      staleThresholdMs: options?.staleThresholdMs ?? 3000,
      preferWebLocksElection: options?.preferWebLocksElection ?? true,
      preferVisibleLeader: options?.preferVisibleLeader ?? false,
    };

    this.knownTabs.set(this.tabId, Date.now());

    // Initialize in browser
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel(`${this.config.channelName}:leader`);
      this.channel.onmessage = (event: MessageEvent) => {
        this.onMessage(event.data as CoordinatorMessage);
      };
      this.start();
    } else {
      // Non-browser (SSR/Node) — always leader
      this.becomeLeader();
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Public API
  // ══════════════════════════════════════════════════════════════════════════════

  /**
   * Whether this tab is currently the leader.
   *
   * @returns `true` if this tab is the elected leader
   */
  public isLeader(): boolean {
    return this.leaderId === this.tabId;
  }

  /**
   * Get the current tab's unique ID.
   *
   * @returns Tab identifier string
   */
  public getTabId(): string {
    return this.tabId;
  }

  /**
   * Get the current leader's tab ID.
   *
   * @returns Leader tab ID or null if unknown
   */
  public getLeaderId(): string | null {
    return this.leaderId;
  }

  /**
   * Get the current role of this tab.
   *
   * @returns 'leader' or 'follower'
   */
  public getRole(): TabRole {
    return this.currentRole;
  }

  /**
   * Get information about all known active tabs.
   *
   * @returns Array of active tab descriptors
   */
  public getActiveTabs(): ITabInfo[] {
    const now = Date.now();
    const tabs: ITabInfo[] = [];
    for (const [id, lastSeen] of this.knownTabs) {
      if (now - lastSeen < this.config.staleThresholdMs * 2) {
        tabs.push({ id, isLeader: id === this.leaderId, lastSeen, isSelf: id === this.tabId });
      }
    }
    return tabs;
  }

  /**
   * Get the number of active tabs.
   *
   * @returns Active tab count
   */
  public getTabCount(): number {
    return this.getActiveTabs().length;
  }

  /**
   * Register a callback for role changes.
   *
   * @param listener - Called when role changes ('leader' or 'follower')
   * @returns Unsubscribe function
   */
  public onRoleChange(listener: RoleListener): () => void {
    this.roleListeners.add(listener);
    return () => {
      this.roleListeners.delete(listener);
    };
  }

  /**
   * Voluntarily resign leadership.
   */
  public resign(): void {
    if (!this.isLeader()) return;
    this.postMessage({ kind: CoordinatorMessageKind.RESIGNED, tabId: this.tabId });
    this.leaderId = null;
    this.stopHeartbeat();
    this.setRole('follower');
  }

  /**
   * Destroy the coordinator and release all resources.
   */
  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.isLeader()) this.resign();
    this.stopHeartbeat();
    this.stopStaleCheck();
    this.channel?.close();
    this.channel = null;
    this.roleListeners.clear();
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Private — Election Protocol
  // ══════════════════════════════════════════════════════════════════════════════

  /** Start the election process. */
  private start(): void {
    this.postMessage({ kind: CoordinatorMessageKind.ANNOUNCE, tabId: this.tabId, at: Date.now() });
    // Attempt to claim after a short delay (allows existing leader to respond)
    setTimeout(() => {
      if (this.destroyed) return;
      if (!this.leaderId) this.claimLeadership();
      this.startStaleCheck();
    }, this.config.heartbeatMs);
  }

  /** Attempt to claim leadership. */
  private claimLeadership(): void {
    if (this.leaderId && Date.now() - this.lastHeartbeatAt < this.config.staleThresholdMs) return;
    this.postMessage({ kind: CoordinatorMessageKind.CLAIM, tabId: this.tabId, at: Date.now() });
    setTimeout(() => {
      if (this.destroyed) return;
      if (!this.leaderId || this.leaderId === this.tabId) this.becomeLeader();
    }, this.config.heartbeatMs);
  }

  /** Promote this tab to leader. */
  private becomeLeader(): void {
    this.leaderId = this.tabId;
    this.startHeartbeat();
    this.setRole('leader');
  }

  /** Handle incoming messages. */
  private onMessage(msg: CoordinatorMessage): void {
    if (this.destroyed) return;
    if ('tabId' in msg) {
      const isNew = !this.knownTabs.has(msg.tabId);
      this.knownTabs.set(msg.tabId, Date.now());
      if (isNew && msg.tabId !== this.tabId) {
        this.emit(COORDINATOR_EVENTS.TAB_JOINED, { tabId: msg.tabId });
      }
    }

    switch (msg.kind) {
      case CoordinatorMessageKind.HEARTBEAT:
        this.leaderId = msg.tabId;
        this.lastHeartbeatAt = msg.at;
        if (this.isLeader() && msg.tabId !== this.tabId) {
          this.stopHeartbeat();
          this.setRole('follower');
        }
        break;
      case CoordinatorMessageKind.CLAIM:
        if (this.isLeader() && msg.tabId < this.tabId) {
          this.stopHeartbeat();
          this.leaderId = msg.tabId;
          this.lastHeartbeatAt = msg.at;
          this.setRole('follower');
        }
        break;
      case CoordinatorMessageKind.RESIGNED:
        if (this.leaderId === msg.tabId) {
          this.leaderId = null;
          this.claimLeadership();
        }
        break;
      case CoordinatorMessageKind.ANNOUNCE:
        if (this.isLeader()) {
          this.postMessage({
            kind: CoordinatorMessageKind.HEARTBEAT,
            tabId: this.tabId,
            at: Date.now(),
          });
        }
        break;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Private — Timers
  // ══════════════════════════════════════════════════════════════════════════════

  private startHeartbeat(): void {
    this.stopHeartbeat();
    const beat = () =>
      this.postMessage({
        kind: CoordinatorMessageKind.HEARTBEAT,
        tabId: this.tabId,
        at: Date.now(),
      });
    beat();
    this.heartbeatTimer = setInterval(beat, this.config.heartbeatMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private startStaleCheck(): void {
    this.staleCheckTimer = setInterval(() => {
      if (this.destroyed || this.isLeader()) return;
      if (this.leaderId && Date.now() - this.lastHeartbeatAt > this.config.staleThresholdMs) {
        this.leaderId = null;
        this.claimLeadership();
      }
      // Prune stale tabs
      const now = Date.now();
      for (const [id, lastSeen] of this.knownTabs) {
        if (id !== this.tabId && now - lastSeen > this.config.staleThresholdMs * 3) {
          this.knownTabs.delete(id);
          this.emit(COORDINATOR_EVENTS.TAB_LEFT, { tabId: id });
        }
      }
    }, this.config.heartbeatMs);
  }

  private stopStaleCheck(): void {
    if (this.staleCheckTimer) {
      clearInterval(this.staleCheckTimer);
      this.staleCheckTimer = null;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Private — Helpers
  // ══════════════════════════════════════════════════════════════════════════════

  private postMessage(msg: CoordinatorMessage): void {
    try {
      this.channel?.postMessage(msg);
    } catch {
      /* channel closed */
    }
  }

  private setRole(role: TabRole): void {
    if (this.currentRole === role) return;
    this.currentRole = role;

    // Emit lifecycle event via @stackra/events (optional)
    if (role === 'leader') {
      this.emit(COORDINATOR_EVENTS.LEADER_ELECTED, { tabId: this.tabId });
    } else {
      this.emit(COORDINATOR_EVENTS.LEADER_RESIGNED, { tabId: this.tabId });
    }

    for (const listener of this.roleListeners) {
      try {
        listener(role);
      } catch {
        /* listener error */
      }
    }
  }

  private generateTabId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Emit a coordinator lifecycle event via the optional EventEmitter.
   * Fail-open: never let event emission break coordination logic.
   *
   * @param event - Event name from COORDINATOR_EVENTS
   * @param payload - Event payload
   */
  private emit(event: string, payload: Record<string, unknown>): void {
    if (!this.eventEmitter) return;
    try {
      this.eventEmitter.emit(event, payload);
    } catch {
      // Event emission must never break coordination
    }
  }
}
