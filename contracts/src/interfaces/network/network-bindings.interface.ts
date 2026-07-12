/**
 * @file network-bindings.interface.ts
 * @module @stackra/contracts/interfaces/network
 * @description Platform-agnostic contract for the `@stackra/network`
 *   package's bindings pattern.
 *
 *   The `INetworkBindings` interface decouples the cross-platform
 *   `NetworkService` (and its React hook `useNetworkStatus`) from the
 *   underlying platform APIs that actually answer the question
 *   "are we online?". Each platform supplies its own implementation:
 *
 *   - `WebNetworkBindings`    — `navigator.onLine` + Network Information API
 *   - `NativeNetworkBindings` — `@react-native-community/netinfo`
 *   - `NodeNetworkBindings`   — DNS lookup polling
 *
 *   The shared, DI-managed service injects this contract via the
 *   `NETWORK_BINDINGS` token, never the concrete implementation, which
 *   keeps the service runtime- and platform-agnostic.
 *
 *   This is the canonical reference for the **bindings pattern**:
 *
 *     1. Interface lives in `@stackra/contracts`           (this file)
 *     2. Token in `@stackra/contracts/tokens/network.tokens.ts`
 *     3. Default null-impl + helpful error in core         (NullNetworkBindings)
 *     4. Concrete adapter per platform (Web/Native/Node)
 *     5. Platform module's `forRoot()` binds `useClass: ConcreteBindings`
 *     6. Consumers inject `NETWORK_BINDINGS` — never a concrete class
 *
 *   See also: `cross-platform-hooks.md` steering rule.
 */

import type { INetworkStatus } from './network-status.interface';

/**
 * Contract every platform-specific network-bindings adapter must satisfy.
 *
 * The interface is intentionally narrow — four methods cover synchronous
 * reads (`isOnline`), one-shot queries (`getStatus`), subscriptions
 * (`subscribe`), and lifecycle (`destroy`). Adapters add no public surface
 * beyond this contract; richer functionality (event emission, caching,
 * multiplexing of subscribers) lives in the higher-level `NetworkService`
 * that wraps the bindings.
 *
 * Implementations MUST be safe to construct lazily (the DI container may
 * instantiate them on first inject) and MUST NOT leak resources — any
 * timers, event listeners, or platform subscriptions opened by the
 * adapter must be released in `destroy()`.
 *
 * @example Web adapter skeleton
 * ```typescript
 * import { Injectable } from '@stackra/container';
 * import type { INetworkBindings, INetworkStatus } from '@stackra/contracts';
 *
 * @Injectable()
 * export class WebNetworkBindings implements INetworkBindings {
 *   isOnline(): boolean { return navigator.onLine; }
 *   async getStatus(): Promise<INetworkStatus> { ... }
 *   subscribe(cb: (s: INetworkStatus) => void): () => void { ... }
 *   destroy(): void { ... }
 * }
 * ```
 */
export interface INetworkBindings {
  /**
   * Synchronously return the most recently observed online state.
   *
   * Implementations should answer immediately from a cached boolean so
   * this method is cheap to call inside hot paths or React render
   * functions. The first call after construction may return the platform
   * default (typically `true`) until the adapter's internal subscription
   * sees its first event.
   *
   * @returns `true` if the device is currently considered online.
   */
  isOnline(): boolean;

  /**
   * Fetch the full network status snapshot.
   *
   * Unlike {@link isOnline}, this may perform a small amount of async
   * work (read NetInfo, probe `navigator.connection`, perform a DNS
   * lookup) and is intended for one-shot reads where richer information
   * (connection type, speed) matters.
   *
   * @returns Resolves with the current {@link INetworkStatus}. Must
   *   NOT reject on transient platform errors — fall back to a
   *   sensible default (`isOnline: true, type: 'unknown'`) and let
   *   subscribers learn about errors via the next `subscribe` notification.
   */
  getStatus(): Promise<INetworkStatus>;

  /**
   * Subscribe to network status changes.
   *
   * The callback runs every time the underlying platform reports a
   * change (e.g. `online`/`offline` window events, NetInfo state
   * change, polling tick that flipped). Implementations MUST debounce
   * or deduplicate where the platform would otherwise emit a torrent
   * of identical events.
   *
   * Subscribers MUST treat the callback as fire-and-forget — failures
   * inside listeners MUST NOT crash the bindings adapter or other
   * subscribers.
   *
   * @param listener - Callback invoked with the new status on every change.
   * @returns Unsubscribe function. Idempotent — calling twice is a no-op.
   */
  subscribe(listener: (status: INetworkStatus) => void): () => void;

  /**
   * Release platform resources held by this adapter.
   *
   * Implementations MUST:
   * - Remove all attached event listeners (window/document, NetInfo, etc.)
   * - Clear any internal timers (DNS polling intervals, etc.)
   * - Drop all subscriber references so they can be garbage-collected
   *
   * After `destroy()` returns, calling any other method (besides
   * `destroy` itself, which must be idempotent) is undefined behaviour.
   */
  destroy(): void;
}
