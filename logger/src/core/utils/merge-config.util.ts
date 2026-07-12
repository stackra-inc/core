/**
 * @file merge-config.util.ts
 * @module @stackra/logger/core/utils
 * @description Single source of truth for merging user-supplied
 *   logger options with {@link DEFAULT_LOGGER_CONFIG}. Both
 *   `forRoot()` and `forRootAsync()` route through this helper so
 *   defaults + environment overrides stay consistent.
 *
 *   Merge order (later layers win):
 *     1. `DEFAULT_LOGGER_CONFIG`
 *     2. Caller-provided `options`
 *     3. `applyEnvironmentOverrides()`  — `NODE_ENV` toggles
 *     4. `applyEnvVarOverrides()`       — `LOG_LEVEL`, `APP_DEBUG`
 */

import type { ILoggerModuleConfig } from '@stackra/contracts';

import { DEFAULT_LOGGER_CONFIG } from '../constants/default-logger-config.constant';
import { applyEnvironmentOverrides, applyEnvVarOverrides } from './env-overrides.util';

/**
 * Merge user options into the default logger config and apply
 * environment overrides.
 *
 * @param options - User-supplied partial configuration.
 * @returns Fully resolved logger configuration.
 */
export function mergeConfig(options: Partial<ILoggerModuleConfig> = {}): ILoggerModuleConfig {
  let merged: ILoggerModuleConfig = {
    ...DEFAULT_LOGGER_CONFIG,
    ...options,
    channels: {
      ...DEFAULT_LOGGER_CONFIG.channels,
      ...options.channels,
    },
  };

  merged = applyEnvironmentOverrides(merged);
  merged = applyEnvVarOverrides(merged);

  return merged;
}
