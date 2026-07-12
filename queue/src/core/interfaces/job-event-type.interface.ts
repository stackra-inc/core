/**
 * @file job-event-type.interface.ts
 * @module @stackra/queue/core/interfaces
 * @description Type definition for job lifecycle events.
 */

/**
 * Supported job lifecycle event types.
 *
 * Used by the @OnJobEvent() decorator to subscribe to worker events.
 */
export type JobEventType =
  | 'completed'
  | 'failed'
  | 'active'
  | 'progress'
  | 'stalled'
  | 'waiting'
  | 'delayed'
  | 'removed'
  | 'drained';
