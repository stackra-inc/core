/**
 * @file sdui-layout-ref.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Reference to a layout from a `SduiDocument`. The `name`
 *   field is the registered layout name (`'app'`, `'auth'`,
 *   `'landing'`, …). The optional `options` field carries
 *   layout-specific configuration (sidebar side, scroll mode, etc.).
 */

/**
 * Pointer to a layout in the LayoutRegistry plus its layout-specific
 * options bag. Options are layout-specific; refer to each layout's
 * documentation for the exact shape.
 */
export interface ISduiLayoutRef {
  /**
   * Registered layout name. The renderer resolves this through
   * `LayoutRegistry.get(name)`; unknown names fall back to the
   * documented `'embed'` layout and emit a dev-only warning.
   */
  readonly name: string;

  /**
   * Optional, layout-specific configuration. For the `'app'` layout
   * this carries every public `AppLayoutProps` value (sidebar side,
   * scroll mode, resizable, keyboard shortcuts, …); for the `'auth'`
   * layout it is typically empty.
   */
  readonly options?: Readonly<Record<string, unknown>>;
}
