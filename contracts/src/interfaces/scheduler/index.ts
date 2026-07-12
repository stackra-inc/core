/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/scheduler
 * @description Barrel for scheduler event payload types.
 */
export type {
  ISchedulerEventBase,
  ISchedulerTaskRegisteredPayload,
  ISchedulerTaskStartedPayload,
  ISchedulerTaskCompletedPayload,
  ISchedulerTaskFailedPayload,
  ISchedulerTaskUnregisteredPayload,
  ISchedulerTaskPausedPayload,
  ISchedulerTaskResumedPayload,
} from './scheduler-event-payloads.interface';
