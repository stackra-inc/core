/**
 * @file default-logger-config.constant.ts
 * @module @stackra/logger/core/constants
 * @description Default configuration for `LoggerModule.forRoot()`.
 *   Used by `mergeConfig()` as the base layer that user options
 *   override before environment overrides are applied.
 */

import type { ILoggerModuleConfig } from '@stackra/contracts';

/**
 * Default logger module configuration.
 *
 * Ships with one channel (`console`) at `debug` level, so a call to
 * `LoggerModule.forRoot()` with no arguments produces a working
 * console logger.
 */
export const DEFAULT_LOGGER_CONFIG: ILoggerModuleConfig = {
  default: 'console',
  channels: {
    console: {
      driver: 'single',
      reporters: ['console'],
      level: 'debug',
    },
  },
};
