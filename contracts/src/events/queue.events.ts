/**
 * @file queue.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by `@stackra/queue`.
 *
 *   Emitted by `QueueEventBus` on the optional `EVENT_EMITTER` bus
 *   whenever a job moves through its lifecycle (dispatch, start,
 *   completion, failure, dead-letter).
 *
 *   @example
 *   ```typescript
 *   import { QUEUE_EVENTS } from '@stackra/contracts';
 *
 *   @OnEvent(QUEUE_EVENTS.JOB_FAILED)
 *   onJobFailed(payload: { jobId: string; queue: string; error: string }) {
 *     metrics.increment('queue.job.failed', { queue: payload.queue });
 *   }
 *   ```
 */

/**
 * Queue lifecycle event names.
 *
 * Payload shapes:
 * - `JOB_DISPATCHED` — `{ jobId, queue, name, at }`
 * - `JOB_STARTED`    — `{ jobId, queue, name, at }`
 * - `JOB_COMPLETED`  — `{ jobId, queue, name, durationMs, at }`
 * - `JOB_FAILED`     — `{ jobId, queue, name, error, attempt, at }`
 * - `JOB_DEAD`       — `{ jobId, queue, name, at }` (max attempts exceeded)
 */
export const QUEUE_EVENTS = {
  /** A job was dispatched to a queue. */
  JOB_DISPATCHED: 'queue.job.dispatched',
  /** A job started processing. */
  JOB_STARTED: 'queue.job.started',
  /** A job completed successfully. */
  JOB_COMPLETED: 'queue.job.completed',
  /** A job failed (may retry). */
  JOB_FAILED: 'queue.job.failed',
  /** A job exceeded max attempts and moved to the dead-letter queue. */
  JOB_DEAD: 'queue.job.dead',
} as const;

/**
 * Union type of every emitted queue event name.
 */
export type QueueEventName = (typeof QUEUE_EVENTS)[keyof typeof QUEUE_EVENTS];
