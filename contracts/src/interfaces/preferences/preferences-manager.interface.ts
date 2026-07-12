/**
 * @file preferences-manager.interface.ts
 * @module @stackra/contracts/interfaces/preferences
 * @description Public contract for the `@stackra/preferences` manager.
 *
 *   Matches the `Manager<TDriver>` pattern used by `@stackra/cache`,
 *   `@stackra/logger`, and other Manager+Driver packages in the
 *   monorepo. Concrete implementations extend `Manager<IPreferencesStore>`
 *   from `@stackra/support`; that base class provides lazy resolution,
 *   per-name caching, and `extend()` for runtime driver registration.
 *
 *   The interface here is intentionally narrow — three methods cover the
 *   100% of consumer use cases. Internal helpers (`forgetDrivers`,
 *   `getDrivers`) stay on the concrete class.
 */

import type { IPreferencesStore } from './preferences-store.interface';

/**
 * Factory invoked the first time a driver is requested. Receives an
 * optional config blob handed down from `manager.extend(name, factory)`
 * call sites. Concrete drivers usually ignore the parameter.
 */
export type PreferencesStoreCreator = (config?: unknown) => IPreferencesStore;

/**
 * Public manager API.
 *
 * Bound to `PREFERENCES_MANAGER` in the DI container. Consumers either
 * inject the token and call `.store(name)`, or use the `usePreference`
 * React hook (which resolves the manager internally).
 *
 * @example Read/write through a named store
 * ```typescript
 * const manager = useInject<IPreferencesManager>(PREFERENCES_MANAGER);
 * await manager.store('localStorage').set('theme', 'dark');
 * const theme = await manager.store('localStorage').get<'light' | 'dark'>('theme');
 * ```
 *
 * @example Register a runtime store
 * ```typescript
 * manager.extend('vercel-kv', () => new VercelKvPreferencesStore({ token }));
 * await manager.store('vercel-kv').set('flag:beta', true);
 * ```
 */
export interface IPreferencesManager {
  /**
   * Return the configured default driver name.
   *
   * Mirrors `Manager.getDefaultDriver()` from `@stackra/support`. Set
   * via `PreferencesModule.forRoot({ default })` or auto-set by the
   * first platform module to register a store.
   */
  getDefaultDriver(): string;

  /**
   * Resolve a named store. Returns the same instance on every call
   * (lazy + cached).
   *
   * @param name - Store name. Omit to use the default.
   * @returns The matching `IPreferencesStore`.
   * @throws {Error} If `name` is unknown and not registered as a custom driver.
   */
  store(name?: string): IPreferencesStore;

  /**
   * Register a custom driver factory.
   *
   * Use to plug in a backend at runtime (e.g., after the user
   * authenticates with a customer-managed KV provider). Custom drivers
   * take priority over the manager's built-in `create*Driver` methods.
   *
   * @param name - Unique driver name.
   * @param creator - Factory called once on first `store(name)` access.
   * @returns The manager (for chaining).
   */
  extend(name: string, creator: PreferencesStoreCreator): this;
}
