/**
 * @file preferences.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the `@stackra/preferences` package.
 *
 *   Three tokens, three roles:
 *
 *   - `PREFERENCES_MANAGER` — the `IPreferencesManager` instance, registered
 *     by `PreferencesModule.forRoot()`. Consumers inject this to access
 *     named stores.
 *
 *   - `PREFERENCES_CONFIG` — the resolved `PreferencesModule` options
 *     (default store name, logging, etc.). Available for introspection
 *     by observability layers.
 *
 *   - `PREFERENCES_STORE_METADATA_KEY` — metadata key written by the
 *     `@PreferencesStore('name')` decorator. The loader reads this to
 *     auto-register decorated classes with the manager at boot time.
 */

/**
 * DI token for the `IPreferencesManager` singleton.
 *
 * @example
 * ```typescript
 * const manager = useInject<IPreferencesManager>(PREFERENCES_MANAGER);
 * await manager.store('localStorage').set('theme', 'dark');
 * ```
 */
export const PREFERENCES_MANAGER = Symbol.for('PREFERENCES_MANAGER');

/**
 * DI token for the resolved `PreferencesModule` configuration.
 *
 * Bound by `PreferencesModule.forRoot({ ... })` via `useValue` with the
 * caller-supplied options. Read by health indicators, observability
 * layers, and custom drivers that need to inspect module settings.
 */
export const PREFERENCES_CONFIG = Symbol.for('PREFERENCES_CONFIG');

/**
 * Metadata key used by the `@PreferencesStore('name')` class decorator.
 *
 * The discovery loader scans every provider for this metadata at
 * `onModuleInit()` and registers the decorated class with the manager
 * under the provided name.
 */
export const PREFERENCES_STORE_METADATA_KEY = 'stackra:preferences:store';
