/**
 * @file queue.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens and metadata keys for the queue subsystem.
 *
 *   Tokens live in contracts so cross-package consumers (processor
 *   loaders, dashboards, workers) can reference them without pulling
 *   in the runtime.
 */

/** Token for the QueueManager singleton. */
export const QUEUE_MANAGER = Symbol.for('QUEUE_MANAGER');

/** Token for the queue module configuration. */
export const QUEUE_CONFIG = Symbol.for('QUEUE_CONFIG');

/** Metadata key for the `@Processor()` decorator. */
export const PROCESSOR_METADATA_KEY = 'stackra:queue:processor';

/** Metadata key for the `@OnJobEvent()` decorator. */
export const ON_JOB_EVENT_METADATA_KEY = 'stackra:queue:on-job-event';
