/**
 * @file scheduler.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by `@stackra/scheduler`.
 *
 *   Emitted by `SchedulerService` on the optional `EVENT_EMITTER` bus
 *   for every scheduled-task lifecycle transition.
 *
 *   @example
 *   ```typescript
 *   import { SCHEDULER_EVENTS } from '@stackra/contracts';
 *
 *   @OnEvent(SCHEDULER_EVENTS.TASK_FAILED)
 *   onTaskFailed(payload: { name: string; error: unknown }) {
 *     alerting.notify('scheduled task failed', payload);
 *   }
 *   ```
 */

/**
 * Scheduler task lifecycle event names.
 *
 * Payload shapes:
 * - `TASK_REGISTERED`   — `{ name, options }`
 * - `TASK_STARTED`      — `{ name }`
 * - `TASK_COMPLETED`    — `{ name, timestamp }`
 * - `TASK_FAILED`       — `{ name, error }`
 * - `TASK_UNREGISTERED` — `{ name }`
 * - `TASK_PAUSED`       — `{ name }`
 * - `TASK_RESUMED`      — `{ name }`
 */
export const SCHEDULER_EVENTS = {
  /** A task was registered with the runner. */
  TASK_REGISTERED: 'scheduler.task.registered',
  /** A task started executing. */
  TASK_STARTED: 'scheduler.task.started',
  /** A task completed successfully. */
  TASK_COMPLETED: 'scheduler.task.completed',
  /** A task failed (the wrapped fn threw). */
  TASK_FAILED: 'scheduler.task.failed',
  /** A task was unregistered. */
  TASK_UNREGISTERED: 'scheduler.task.unregistered',
  /** A task was paused. */
  TASK_PAUSED: 'scheduler.task.paused',
  /** A previously paused task was resumed. */
  TASK_RESUMED: 'scheduler.task.resumed',
} as const;

/** Union type of every emitted scheduler event name. */
export type SchedulerEventName = (typeof SCHEDULER_EVENTS)[keyof typeof SCHEDULER_EVENTS];
