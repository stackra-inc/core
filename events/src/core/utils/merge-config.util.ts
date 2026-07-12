/**
 * @file merge-config.util.ts
 * @module @stackra/events/utils
 * @description Single source of truth for merging user-supplied
 *   event emitter options with `DEFAULT_EVENTS_CONFIG`. Both
 *   `forRoot()` and any future async path route through this helper.
 */

import type { IEventEmitterConfig } from '../interfaces';
import { DEFAULT_EVENTS_CONFIG } from '../constants/default-events-config.constant';

/**
 * Merge user options into the default events config.
 *
 * @param options - User-supplied partial configuration.
 * @returns Fully resolved configuration with defaults applied.
 */
export function mergeConfig(options?: IEventEmitterConfig): IEventEmitterConfig {
  return {
    ...DEFAULT_EVENTS_CONFIG,
    ...options,
  };
}
