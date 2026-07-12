/**
 * @file default-events-config.constant.ts
 * @module @stackra/events/constants
 * @description Default configuration for `EventEmitterModule.forRoot()`.
 *   Used by `mergeEventsConfig()` as the base layer that user options
 *   override.
 */

import type { IEventEmitterConfig } from '../interfaces';

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
