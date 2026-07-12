/**
 * @file scheduler.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the scheduler package.
 */

/** Token for the SchedulerService. */
export const SCHEDULER_SERVICE = Symbol.for('SCHEDULER_SERVICE');

/** Token for the scheduler module configuration. */
export const SCHEDULER_CONFIG = Symbol.for('SCHEDULER_CONFIG');

/** Metadata key for @Scheduled class decorator. */
export const SCHEDULED_METADATA_KEY = Symbol.for('stackra:scheduler:scheduled');

/** DI token for the platform-specific task runner implementation. */
export const TASK_RUNNER = Symbol.for('TASK_RUNNER');
