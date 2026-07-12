/**
 * @file health.events.ts
 * @module @stackra/contracts/events
 * @description Event constants emitted by the health check system.
 */

/** Events emitted by the health check system. */
export const HEALTH_EVENTS = {
  /** Emitted after a health check run completes. */
  CHECK_COMPLETED: 'health.check.completed',
  /** Emitted when overall health status changes. */
  STATUS_CHANGED: 'health.status.changed',
  /** Emitted when overall system status changes. */
  SYSTEM_STATUS_CHANGED: 'health.system.status.changed',
  /** Emitted when an indicator transitions to DOWN. */
  INDICATOR_DOWN: 'health.indicator.down',
  /** Emitted when an indicator recovers to UP. */
  INDICATOR_RECOVERED: 'health.indicator.recovered',
  /** Emitted when an indicator enters DEGRADED state. */
  INDICATOR_DEGRADED: 'health.indicator.degraded',
} as const;
