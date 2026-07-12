/**
 * @file env-overrides.util.ts
 * @module @stackra/logger/utils
 * @description Environment variable helpers for logger configuration.
 */

import { LogLevel } from '@stackra/contracts';
import type { ILoggerModuleConfig } from '@stackra/contracts';

/**
 * Read an environment variable (works in Node and Vite).
 *
 * @param name - Variable name
 * @returns The value or undefined
 */
export function getEnvVar(name: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }
  return undefined;
}

/**
 * Resolve a string to a LogLevel enum value.
 *
 * @param value - String level name
 * @returns The matching LogLevel or undefined
 */
export function resolveLogLevel(value: string): LogLevel | undefined {
  const lower = value.toLowerCase();
  return Object.values(LogLevel).find((l) => l === lower) as LogLevel | undefined;
}

/**
 * Apply LOG_LEVEL env var override to config.
 *
 * @param config - The logger config to modify
 * @returns Config with env overrides applied
 */
export function applyEnvVarOverrides(config: ILoggerModuleConfig): ILoggerModuleConfig {
  const envLevel = getEnvVar('LOG_LEVEL');
  if (envLevel) {
    const resolved = resolveLogLevel(envLevel);
    if (resolved) {
      config.level = resolved;
    }
  }
  return config;
}

/**
 * Apply APP_DEBUG=true override (forces debug level).
 *
 * @param config - The logger config to modify
 * @returns Config with environment overrides applied
 */
export function applyEnvironmentOverrides(config: ILoggerModuleConfig): ILoggerModuleConfig {
  const debug = getEnvVar('APP_DEBUG');
  if (debug === 'true' || debug === '1') {
    config.level = LogLevel.DEBUG;
  }
  return applyEnvVarOverrides(config);
}
