/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/queue
 * @description Barrel for queue event payload types.
 */
export type {
  IQueueEventBase,
  IQueueJobDispatchedPayload,
  IQueueJobStartedPayload,
  IQueueJobCompletedPayload,
  IQueueJobFailedPayload,
  IQueueJobDeadPayload,
} from './queue-event-payloads.interface';
