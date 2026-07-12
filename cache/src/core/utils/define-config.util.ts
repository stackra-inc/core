/**
 * @file define-config.util.ts
 * @module @stackra/cache/core/utils
 * @description Type-safe configuration builder for the cache module.
 *   Provides IDE autocompletion and validation for cache configurations.
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

import type { ICacheModuleConfig } from '@/core/interfaces';

/**
 * Type-safe configuration builder for the cache module.
 *
 * Returns the config object unchanged — its purpose is to provide
 * TypeScript type checking and IDE autocompletion for cache configurations
 * defined in separate config files.
 *
 * @param config - The cache module configuration object
 * @returns The same config object, fully typed
 *
 * @example
 * ```typescript
 * // config/cache.config.ts
 * import { defineConfig } from '@stackra/cache';
 *
 * export default defineConfig({
 *   default: 'memory',
 *   stores: {
 *     memory: { driver: 'memory' },
 *     null: { driver: 'null' },
 *   },
 *   prefix: 'app:',
 *   ttl: 3600,
 * });
 * ```
 */
export function defineConfig(config: ICacheModuleConfig): ICacheModuleConfig {
  return config;
}
