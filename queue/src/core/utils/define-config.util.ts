/**
 * @file define-config.util.ts
 * @module @stackra/queue/core/utils
 * @description Type-safe configuration builder for the queue module.
 *   Provides IDE autocompletion and validation for queue configurations
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

import type { IQueueModuleOptions } from '@/core/interfaces';

/**
 * Type-safe configuration builder for the queue module.
 *
 * @param config - The queue module configuration object
 * @returns The same config object, fully typed
 *
 * @example
 * ```typescript
 * // config/queue.config.ts
 * import { defineConfig } from '@stackra/queue';
 *
 * export default defineConfig({
 *   default: 'memory',
 *   connections: {
 *     memory: { driver: 'memory' },
 *     indexeddb: { driver: 'indexeddb', dbName: 'app-queue' },
 *   },
 *   worker: { tries: 3, backoffMs: 1000, timeoutMs: 30000 },
 * });
 * ```
 */
export function defineConfig(config: IQueueModuleOptions): IQueueModuleOptions {
  return config;
}
