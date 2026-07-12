/**
 * @file define-config.util.ts
 * @module @stackra/logger/utils
 * @description Type-safe config factory for logger module options.
 */
/**
 * **Per-module `defineConfig` vs central `registerAs` — which to use?**
 *
 * This helper is a typed identity for **module-level configuration**
 * passed to this package's `forRoot()`. The module merges defaults
 * via its `mergeXConfig()` utility and binds the result under its
 * own contract DI token (e.g. `CACHE_CONFIG`, `LOGGER_CONFIG`, …)
 * which consumers inject directly:
 *
 * ```ts
 * @Injectable()
 * class MyService {
 *   constructor(@Inject(CACHE_CONFIG) private cfg: ICacheModuleConfig) {}
 * }
 * ```
 *
 * For **application-level injectable configuration** — database
 * credentials, mail settings, third-party API keys, business-level
 * settings — use `registerAs(namespace, factory)` from
 * `@stackra/config` instead. `registerAs` returns a factory
 * tagged with a `.KEY` symbol you inject with `@Inject(cfg.KEY)`,
 * and `ConfigModule.forRoot({ load: [...] })` binds it in the
 * central config tree.
 *
 * @see {@link registerAs} from `@stackra/config` for the canonical factory creator.
 * See `.kiro/steering/config-architecture.md` for the full guide.
 */

import type { ILoggerModuleConfig } from '@stackra/contracts';
import { DEFAULT_CONFIG } from './default-config.constant';
import { applyEnvironmentOverrides, applyEnvVarOverrides } from './env-overrides.util';

/**
 * Create a type-safe logger configuration.
 *
 * Merges the provided partial config with sensible defaults, then applies
 * environment overrides (APP_DEBUG, LOG_LEVEL).
 *
 * @param config - Partial logger configuration
 * @returns Fully resolved ILoggerModuleConfig
 */
export function defineConfig(config: Partial<ILoggerModuleConfig> = {}): ILoggerModuleConfig {
  let merged: ILoggerModuleConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    channels: {
      ...DEFAULT_CONFIG.channels,
      ...config.channels,
    },
  };

  merged = applyEnvironmentOverrides(merged);
  merged = applyEnvVarOverrides(merged);

  return merged;
}
