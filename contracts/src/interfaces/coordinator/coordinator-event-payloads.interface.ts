/**
 * @file coordinator-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/coordinator
 * @description Typed payloads for every constant in
 *   `COORDINATOR_EVENTS`. Every payload carries the tab id that
 *   originated (or was affected by) the event.
 */

/**
 * Common fields carried by every coordinator event payload.
 */
export interface ICoordinatorEventBase {
  /** Stable tab identifier assigned by `TabCoordinator`. */
  readonly tabId: string;
}

/**
 * Payload for `COORDINATOR_EVENTS.LEADER_ELECTED` — this tab won
 * the leadership election.
 */
export interface ICoordinatorLeaderElectedPayload extends ICoordinatorEventBase {}

/**
 * Payload for `COORDINATOR_EVENTS.LEADER_RESIGNED` — this tab lost
 * or resigned leadership.
 */
export interface ICoordinatorLeaderResignedPayload extends ICoordinatorEventBase {}

/**
 * Payload for `COORDINATOR_EVENTS.TAB_JOINED` — a new tab appeared
 * in the coordination group.
 */
export interface ICoordinatorTabJoinedPayload extends ICoordinatorEventBase {}

/**
 * Payload for `COORDINATOR_EVENTS.TAB_LEFT` — a tab was pruned
 * from the census (closed or timed out).
 */
export interface ICoordinatorTabLeftPayload extends ICoordinatorEventBase {}
