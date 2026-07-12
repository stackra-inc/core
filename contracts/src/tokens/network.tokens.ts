/**
 * @file network.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the `@stackra/network` package.
 *
 *   Tokens live in contracts so any package can inject the network
 *   surface without importing from `@stackra/network` directly (which
 *   would create a circular dependency for consumers that themselves
 *   live below network in the dependency graph).
 *
 *   Three tokens, three roles:
 *
 *   - `NETWORK_BINDINGS` — the platform adapter contract; every platform
 *     module (`Web`, `Native`, `Node`) binds its concrete implementation
 *     under this token via `useClass`.
 *
 *   - `NETWORK_SERVICE`  — the high-level orchestrator; wraps the
 *     bindings, emits `network.status.changed` events, multiplexes
 *     subscriptions among multiple consumers. This is what application
 *     code injects in the common case.
 *
 *   - `NETWORK_CONFIG`   — token for the resolved `NetworkModule` options.
 *     Available so reporters / interceptors / future extensions can read
 *     the active configuration without importing the module class.
 */

/**
 * DI token for the platform-specific `INetworkBindings` implementation.
 *
 * Bound by `WebNetworkModule`, `NativeNetworkModule`, and
 * `NodeNetworkModule` via `{ provide: NETWORK_BINDINGS, useClass: ... }`.
 * The core `NetworkModule.forRoot()` registers a `NullNetworkBindings`
 * default that throws `NetworkBindingsNotConfiguredError` if no platform
 * module has been imported — so misconfiguration surfaces immediately
 * instead of returning silently-wrong online states.
 */
export const NETWORK_BINDINGS = Symbol.for('NETWORK_BINDINGS');

/**
 * DI token for the high-level `NetworkService`.
 *
 * Bound by the core `NetworkModule.forRoot()`. Consumers inject this
 * token (or the `NetworkService` class) to read connectivity state,
 * subscribe to changes, and benefit from automatic event emission.
 */
export const NETWORK_SERVICE = Symbol.for('NETWORK_SERVICE');

/**
 * DI token for the resolved `NetworkModule` configuration.
 *
 * Bound by `NetworkModule.forRoot()` via `useValue: { ...options }`.
 * Available for advanced consumers (custom adapters, logger reporters,
 * health indicators) that need to inspect module options at runtime.
 */
export const NETWORK_CONFIG = Symbol.for('NETWORK_CONFIG');
