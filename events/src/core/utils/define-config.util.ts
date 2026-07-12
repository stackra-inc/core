/**
 * @file define-config.util.ts
 * @module @stackra/events/core/utils
 * @description Type-safe configuration builder for the events module.
 *   Provides IDE autocompletion and validation for event configurations
 *   defined in separate config files.
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

import type { IEventEmitterConfig } from '@/core/interfaces';

/**
 * Type-safe configuration builder for the events module.
 *
 * Returns the config object unchanged — its purpose is to provide
 * TypeScript type checking and IDE autocompletion.
 *
 * @param config - The event emitter configuration object
 * @returns The same config object, fully typed
 *
 * @example
 * ```typescript
 * // config/events.config.ts
 * import { defineConfig } from '@stackra/events';
 *
 * export default defineConfig({
 *   wildcard: true,
 *   delimiter: '.',
 *   maxListeners: 20,
 *   global: true,
 * });
 * ```
 */
export function defineConfig(config: IEventEmitterConfig): IEventEmitterConfig {
  return config;
}
