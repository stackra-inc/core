/**
 * @file define-config.util.ts
 * @module @stackra/logger/core/utils
 * @description Type-safe configuration builder for the logger module.
 *   Provides IDE autocompletion and validation for configs declared
 *   in separate files.
 *
 *   **Per-module `defineConfig` vs central `registerAs` — which to use?**
 *
 *   This helper is a typed identity for **module-level configuration**
 *   passed to this package's `forRoot()`. The module merges defaults
 *   via {@link mergeConfig} and binds the result under `LOGGER_CONFIG`
 *   which consumers inject directly:
 *
 *   ```ts
 *   @Injectable()
 *   class MyService {
 *     constructor(@Inject(LOGGER_CONFIG) private cfg: ILoggerModuleConfig) {}
 *   }
 *   ```
 *
 *   For **application-level injectable configuration** — database
 *   credentials, API keys, business settings — use
 *   `registerAs(namespace, factory)` from `@stackra/config` instead.
 */

import type { ILoggerModuleConfig } from '@stackra/contracts';

/**
 * Type-safe configuration builder for the logger module.
 *
 * Returns the config object unchanged — its purpose is to provide
 * TypeScript type-checking and IDE autocompletion for logger configs
 * defined in separate `config/*.config.ts` files.
 *
 * The module's `forRoot()` calls {@link mergeConfig} internally to
 * apply defaults and env-var overrides, so this helper stays a pure
 * identity function.
 *
 * @param config - Logger module configuration object.
 * @returns The same object, fully typed.
 *
 * @example
 * ```typescript
 * // config/logger.config.ts
 * import { defineConfig } from '@stackra/logger';
 * import { LogLevel } from '@stackra/contracts';
 *
 * export default defineConfig({
 *   default: 'app',
 *   channels: {
 *     app: { driver: 'single', reporters: ['console'], level: LogLevel.DEBUG },
 *   },
 * });
 * ```
 */
export function defineConfig(config: ILoggerModuleConfig): ILoggerModuleConfig {
  return config;
}
