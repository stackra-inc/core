/**
 * @file index.ts
 * @module @stackra/logger/core/utils
 * @description Barrel export for logger utilities.
 *
 *   Canonical pattern used by every `@stackra/*` module:
 *     - `defineConfig`  — typed identity for `config/*.config.ts` files
 *     - `mergeConfig`   — merges `DEFAULT_LOGGER_CONFIG` + env overrides
 */

export { defineConfig } from './define-config.util';
export { mergeConfig } from './merge-config.util';
export {
  applyEnvironmentOverrides,
  applyEnvVarOverrides,
  getEnvVar,
  resolveLogLevel,
} from './env-overrides.util';
