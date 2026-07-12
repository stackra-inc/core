/**
 * @file sdui-layout.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Contract for a SDUI layout definition. A layout exposes
 *   the set of slots a document may fill plus any layout-level zones
 *   that hosts of `@SduiRenderHook` / `@SduiWidget` can target.
 *
 *   A layout is BOTH a backend declaration (this interface, registered
 *   in `LayoutRegistry`) AND a frontend renderer component
 *   (registered in `LayoutComponentRegistry` on the client side). The
 *   two halves share a name; the registry pairs them at runtime.
 */

import type { ISduiSlotDescriptor } from './sdui-slot-descriptor.interface';
import type { ISduiZoneDescriptor } from './sdui-zone-descriptor.interface';

/**
 * Layout declaration shape registered with `LayoutRegistry`.
 *
 * @typeParam TOptions - Layout-specific options shape (sidebar
 *   resize behaviour for `'app'`, gutter width for `'auth'`, …).
 *   Default is `unknown` so the registry can hold heterogeneous
 *   layouts without explicit casting.
 */
export interface ISduiLayout<TOptions = unknown> {
  /** Layout identifier (e.g. `'app'`, `'auth'`, `'landing'`, `'embed'`). */
  readonly name: string;

  /**
   * Enumeration of the named slots this layout exposes. The document
   * assembler validates that every slot in the assembled document
   * matches a declaration here.
   */
  slots(): readonly ISduiSlotDescriptor[];

  /**
   * Optional layout-level extension zones for `@SduiRenderHook` /
   * `@SduiWidget` contributors. The renderer mounts contributed
   * content at these positions.
   */
  zones?(): readonly ISduiZoneDescriptor[];

  /**
   * Optional default options applied when the document does not
   * carry an explicit `layout.options`. Useful for layouts whose
   * default behaviour differs per tenant or per locale.
   */
  defaultOptions?(): TOptions;
}
