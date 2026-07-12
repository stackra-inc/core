/**
 * @file default-config.constant.ts
 * @module @stackra/logger/utils
 * @description Default logger module configuration.
 */

import type { ILoggerModuleConfig } from '@stackra/contracts';

/** Sensible default configuration for the logger module. */
export const DEFAULT_CONFIG: ILoggerModuleConfig = {
  default: 'console',
  channels: {
    console: {
      driver: 'single',
      reporters: ['console'],
      level: 'debug',
    },
  },
};
