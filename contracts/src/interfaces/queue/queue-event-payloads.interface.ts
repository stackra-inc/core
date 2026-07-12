/**
 * @file queue-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/queue
 * @description Typed payloads for every constant in `QUEUE_EVENTS`.
 */

/**
 * Common fields carried by every queue lifecycle payload.
 */
export interface IQueueEventBase {
  /** Job identifier (unique per queue). */
  readonly jobId: string;
  /** Queue name the job lives on. */
  readonly queue: string;
  /** Job name (worker discriminator). */
  readonly name: string;
  /** ISO-8601 timestamp when the event fired. */
  readonly at: string;
}

/**
 * Payload for `QUEUE_EVENTS.JOB_DISPATCHED` — a producer called
 * `queue.dispatch()` and the job entered the pending set.
 */
export interface IQueueJobDispatchedPayload extends IQueueEventBase {}

/**
 * Payload for `QUEUE_EVENTS.JOB_STARTED` — a worker picked up the
 * job and started processing.
 */
export interface IQueueJobStartedPayload extends IQueueEventBase {}

/**
 * Payload for `QUEUE_EVENTS.JOB_COMPLETED` — the worker returned
 * a successful result.
 */
export interface IQueueJobCompletedPayload extends IQueueEventBase {
  /** Wall-clock processing duration in milliseconds. */
  readonly durationMs: number;
}

/**
 * Payload for `QUEUE_EVENTS.JOB_FAILED` — the worker threw. The
 * job may be retried depending on policy.
 */
export interface IQueueJobFailedPayload extends IQueueEventBase {
  /** Human-readable error message. */
  readonly error: string;
  /** Attempt number (1-based). */
  readonly attempt: number;
}

/**
 * Payload for `QUEUE_EVENTS.JOB_DEAD` — the job exceeded the max
 * attempts policy and was moved to the dead-letter queue.
 */
export interface IQueueJobDeadPayload extends IQueueEventBase {}
