/**
 * @file queue.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the queue package.
 */

/** Token for the QueueManager service. */
export const QUEUE_MANAGER = Symbol.for('QUEUE_MANAGER');

/** Token for the queue module configuration. */
export const QUEUE_CONFIG = Symbol.for('QUEUE_CONFIG');

/** Metadata key for @Processor class decorator. */
export const PROCESSOR_METADATA_KEY = Symbol.for('stackra:queue:processor');

/** Metadata key for @OnJobEvent method decorator. */
export const ON_JOB_EVENT_METADATA_KEY = Symbol.for('stackra:queue:on-job-event');
