/**
 * @file preferences-store.interface.ts
 * @module @stackra/contracts/interfaces/preferences
 * @description Contract for a single key-value backend behind the
 *   `@stackra/preferences` Manager.
 *
 *   A preferences store is a thin async key-value abstraction:
 *
 *     get(key) → value | null
 *     set(key, value)
 *     remove(key)
 *     clear()
 *     has(key)
 *     keys()
 *     subscribe(key, listener) → unsubscribe
 *
 *   Backends include in-memory (universal), `localStorage`/`sessionStorage`
 *   (web), `AsyncStorage`/`SecureStore` (native), and server backends
 *   (Redis, Vercel KV, Cloudflare KV, DynamoDB, file). Each is registered
 *   with the {@link IPreferencesManager} under a name; apps then read/write
 *   by store name.
 *
 *   Every operation returns a Promise so the same call site works with
 *   sync backends (localStorage) and async ones (AsyncStorage, Redis).
 *   Adapters must serialise non-string values via JSON unless the backend
 *   provides native structured storage.
 */

/**
 * A single key-value backend for the preferences manager.
 *
 * Implementations are registered with `PreferencesModule.forFeature(name, Store)`
 * or auto-discovered via the `@PreferencesStore('name')` decorator. The
 * manager keeps them by name; apps then select via
 * `manager.store('localStorage')` or `manager.store()` for the default.
 *
 * @typeParam TValue - Default value type for `get<T>` / `set<T>` calls;
 *   callers can override per call. Defaults to `unknown`.
 */
export interface IPreferencesStore {
  /**
   * Read a value by key.
   *
   * @typeParam T - Expected value type. Callers must narrow themselves
   *   (the store cannot validate the runtime shape).
   * @param key - Storage key. Implementations may namespace internally.
   * @returns The stored value, or `null` if the key is unset.
   */
  get<T = unknown>(key: string): Promise<T | null>;

  /**
   * Write a value by key.
   *
   * Non-string values are serialised as JSON unless the backend supports
   * structured storage natively.
   *
   * @typeParam T - Value type. Anything JSON-serialisable.
   * @param key - Storage key.
   * @param value - Value to persist.
   */
  set<T = unknown>(key: string, value: T): Promise<void>;

  /**
   * Delete a single key.
   *
   * Idempotent — removing an absent key is a no-op.
   *
   * @param key - Storage key.
   */
  remove(key: string): Promise<void>;

  /**
   * Delete every key managed by this store.
   *
   * Stores that share a backing surface (e.g., two localStorage stores
   * with different prefixes) MUST clear only their own namespaced keys.
   */
  clear(): Promise<void>;

  /**
   * Check whether a key is present.
   *
   * @param key - Storage key.
   * @returns `true` if the key is set (even to `null`/`undefined`),
   *   `false` otherwise.
   */
  has(key: string): Promise<boolean>;

  /**
   * List every key managed by this store.
   *
   * Stores that share a backing surface MUST scope to their own
   * namespace (e.g., return only the prefixed keys).
   */
  keys(): Promise<string[]>;

  /**
   * Subscribe to changes for a specific key.
   *
   * Listeners fire whenever the value at `key` changes, including:
   *   - Local writes via `set` / `remove` / `clear`.
   *   - Cross-tab writes (web localStorage `storage` events).
   *   - Cross-process writes for server stores (Redis pub/sub, etc.)
   *     when the backend supports it.
   *
   * The callback receives the *new* value (or `null` after a remove or
   * clear). Implementations MUST debounce or deduplicate so multiple
   * synchronous writes to the same key produce at most one notification
   * with the final value.
   *
   * @param key - Storage key to watch.
   * @param listener - Callback receiving the new value (or `null`).
   * @returns Unsubscribe function. Idempotent.
   */
  subscribe(key: string, listener: (value: unknown | null) => void): () => void;
}
