/**
 * @file coordinator.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by `@stackra/coordinator`.
 *
 *   Emitted by `TabCoordinator` on the optional `EVENT_EMITTER` bus
 *   whenever leadership changes or the census of active tabs
 *   changes. Useful for failover, telemetry, and UI indicators.
 *
 *   @example
 *   ```typescript
 *   import { COORDINATOR_EVENTS } from '@stackra/contracts';
 *
 *   @OnEvent(COORDINATOR_EVENTS.LEADER_ELECTED)
 *   onLeaderElected(payload: { tabId: string }) {
 *     metrics.gauge('coordinator.leader', payload.tabId);
 *   }
 *   ```
 */

/**
 * Coordinator lifecycle event names.
 *
 * Payload shapes:
 * - `LEADER_ELECTED`  — `{ tabId }`
 * - `LEADER_RESIGNED` — `{ tabId }`
 * - `TAB_JOINED`      — `{ tabId }`
 * - `TAB_LEFT`        — `{ tabId }`
 */
export const COORDINATOR_EVENTS = {
  /** This tab became the elected leader. */
  LEADER_ELECTED: 'coordinator.leader.elected',
  /** This tab resigned or lost leadership. */
  LEADER_RESIGNED: 'coordinator.leader.resigned',
  /** A new tab joined the coordination group. */
  TAB_JOINED: 'coordinator.tab.joined',
  /** A tab was pruned from the census (stale / closed). */
  TAB_LEFT: 'coordinator.tab.left',
} as const;

/** Union type of every emitted coordinator event name. */
export type CoordinatorEventName = (typeof COORDINATOR_EVENTS)[keyof typeof COORDINATOR_EVENTS];
