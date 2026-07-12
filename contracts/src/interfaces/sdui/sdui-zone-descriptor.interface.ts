/**
 * @file sdui-zone-descriptor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Distributed registry entry for a named extension
 *   point. Zones let plugin authors target a specific position in a
 *   scene / layout (e.g. `customer.details.side.after`) without
 *   modifying any existing module.
 *
 *   Zones are NOT centralized in `@stackra/contracts` as an enum;
 *   each package contributes its own zones through
 *   `SduiModule.forFeature({ zones })`. The runtime registry rejects
 *   widget / render-hook registrations whose target zone is not in
 *   the registry.
 */

/**
 * One named extension point.
 *
 * @example
 * ```ts
 * { name: 'customer.details.side.after', owner: 'customer',
 *   description: 'Below the customer summary card on the detail page' }
 * ```
 */
export interface ISduiZoneDescriptor {
  /**
   * Dot-separated zone name. Convention:
   * `{owner}.{scene-or-page}.{position}`.
   */
  readonly name: string;

  /**
   * The package or resource that owns the zone. Used for diagnostic
   * output ("zone `xyz` is owned by `customer`").
   */
  readonly owner?: string;

  /** Human-readable description rendered in the SDUI registry UI. */
  readonly description?: string;
}
