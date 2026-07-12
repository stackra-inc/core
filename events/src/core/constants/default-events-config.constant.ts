/**
 * @file default-events-config.constant.ts
 * @module @stackra/events/constants
 * @description Default configuration for `EventEmitterModule.forRoot()`.
 *   Used by `mergeConfig()` as the base layer that user options
 *   override.
 */

import type { IEventEmitterConfig } from '@/core/interfaces';

/**
 * Default event emitter configuration. Applied when callers omit
 * fields from the `forRoot()` options.
 */
export const DEFAULT_EVENTS_CONFIG: IEventEmitterConfig = {
  wildcard: false,
  delimiter: '.',
  maxListeners: 10,
  global: true,
};
