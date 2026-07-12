/**
 * @file define-config.util.ts
 * @module @stackra/container
 * @description Universal type-safe configuration helper.
 *   Works for ANY config type — container options, NestJS application options,
 *   CORS config, module options, etc. Uses TypeScript generics to infer the
 *   shape from the caller's type annotation.
 *
 *   Follows the same `defineConfig` pattern used by Vite, Vitest, and
 *   other modern tooling — a pure identity function that exists solely for
 *   IDE autocomplete and TypeScript inference.
 *
 * @example
 * ```typescript
 * // Works for any config shape:
 * import { defineConfig } from '@stackra/container';
 *
 * // Container config (frontend)
 * export default defineConfig<IContainerOptions>({ debug: true, globalName: '__APP__' });
 *
 * // Application config (NestJS)
 * export default defineConfig<IApplicationOptions>({ port: 3000, prefix: 'api' });
 *
 * // CORS config
 * export default defineConfig<ICorsOptions>({ origin: true, credentials: true });
 *
 * // Any module config
 * export default defineConfig<IQueueModuleOptions>({ default: 'redis' });
 * ```
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

/**
 * Define a type-safe configuration object.
 *
 * This is a pure identity function — it returns the config unchanged.
 * Its purpose is to provide full IDE autocomplete and TypeScript type
 * checking when defining configuration outside of the consuming function call.
 *
 * @typeParam T - The configuration interface type. When omitted, infers
 *   from the passed object (useful when the type is obvious from context).
 * @param config - The configuration object to validate and return
 * @returns The same config object, fully typed as T
 *
 * @example
 * ```typescript
 * // Explicit generic (recommended for shared config files):
 * export default defineConfig<IApplicationOptions>({
 *   port: 3000,
 *   prefix: 'api',
 *   cors: true,
 *   helmet: true,
 * });
 *
 * // Inferred type (when used inline):
 * const config = defineConfig({ debug: true, globalName: '__APP__' });
 * ```
 */
export function defineConfig<T = Record<string, unknown>>(config: T): T {
  return config;
}
