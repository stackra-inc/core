/**
 * @file scheduler-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/scheduler
 * @description Typed payloads for every constant in `SCHEDULER_EVENTS`.
 */

/**
 * Common fields carried by every scheduler-task lifecycle payload.
 */
export interface ISchedulerEventBase {
  /** Task name (unique within the scheduler). */
  readonly name: string;
}

/**
 * Payload for `SCHEDULER_EVENTS.TASK_REGISTERED` — a task was
 * inserted into the runner registry.
 */
export interface ISchedulerTaskRegisteredPayload extends ISchedulerEventBase {
  /** Options passed to `scheduler.register()` (cron, interval, …). */
  readonly options: Readonly<Record<string, unknown>>;
}

/**
 * Payload for `SCHEDULER_EVENTS.TASK_STARTED` — the runner invoked
 * the task's callback.
 */
export interface ISchedulerTaskStartedPayload extends ISchedulerEventBase {}

/**
 * Payload for `SCHEDULER_EVENTS.TASK_COMPLETED` — the task's
 * callback returned without throwing.
 */
export interface ISchedulerTaskCompletedPayload extends ISchedulerEventBase {
  /** ISO-8601 timestamp when the task completed. */
  readonly timestamp: string;
}

/**
 * Payload for `SCHEDULER_EVENTS.TASK_FAILED` — the callback threw.
 */
export interface ISchedulerTaskFailedPayload extends ISchedulerEventBase {
  /** The thrown value (may be an Error instance or arbitrary value). */
  readonly error: unknown;
}

/**
 * Payload for `SCHEDULER_EVENTS.TASK_UNREGISTERED`.
 */
export interface ISchedulerTaskUnregisteredPayload extends ISchedulerEventBase {}

/**
 * Payload for `SCHEDULER_EVENTS.TASK_PAUSED`.
 */
export interface ISchedulerTaskPausedPayload extends ISchedulerEventBase {}

/**
 * Payload for `SCHEDULER_EVENTS.TASK_RESUMED`.
 */
export interface ISchedulerTaskResumedPayload extends ISchedulerEventBase {}
