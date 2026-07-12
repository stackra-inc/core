/**
 * @file network-status.interface.ts
 * @module @stackra/contracts/interfaces/network
 * @description Cross-package data shape describing the device's current
 *   network connectivity state.
 *
 *   This contract is the value passed through `INetworkBindings.subscribe()`
 *   callbacks, returned from `INetworkBindings.getStatus()`, and carried
 *   in the `network.status.changed` event payload. It lives in
 *   `@stackra/contracts` so any package (web adapter, native adapter,
 *   Node detector, NestJS service, React hook, etc.) can type-check
 *   against the same shape without circular imports.
 */

/**
 * Connection type as reported by the platform's network API.
 *
 * - `wifi`      — connected to a Wi-Fi network
 * - `cellular`  — connected via the mobile data network
 * - `ethernet`  — wired connection
 * - `unknown`   — the platform could not determine the connection type
 *                 (still a connection, just untyped)
 */
export type NetworkConnectionType = 'wifi' | 'cellular' | 'ethernet' | 'unknown';

/**
 * Snapshot of the device's network connectivity at a point in time.
 *
 * Returned by every {@link INetworkBindings} implementation regardless of
 * the underlying platform (browser, React Native, Node.js). Implementations
 * fill the fields they can detect and leave optional fields `undefined`
 * when the underlying API does not surface that information.
 *
 * @example
 * ```typescript
 * const status: INetworkStatus = {
 *   isOnline: true,
 *   type: 'wifi',
 *   downlinkSpeed: 12.5,
 *   effectiveType: '4g',
 * };
 * ```
 */
export interface INetworkStatus {
  /**
   * Whether the device currently has network connectivity.
   *
   * Platforms differ on what counts as "online":
   * - Browser: `navigator.onLine` (interface-up, not actual reach)
   * - React Native: `NetInfo.isConnected` (interface-up + reach probe)
   * - Node.js: result of a DNS lookup probe against a known host
   */
  readonly isOnline: boolean;

  /**
   * Type of the active connection, if the platform reports it.
   * `undefined` if the platform did not expose connection-type info.
   */
  readonly type?: NetworkConnectionType;

  /**
   * Estimated downlink throughput in megabits per second, when available.
   *
   * Reported by the browser Network Information API and similar native
   * APIs. May be `undefined` on platforms that do not expose this metric
   * or when the connection is offline.
   */
  readonly downlinkSpeed?: number;

  /**
   * "Effective" connection class as reported by the browser Network
   * Information API: one of `'slow-2g'`, `'2g'`, `'3g'`, `'4g'`.
   *
   * Useful for showing degraded-experience prompts on slow connections.
   * `undefined` on platforms that do not implement the API.
   */
  readonly effectiveType?: string;
}
