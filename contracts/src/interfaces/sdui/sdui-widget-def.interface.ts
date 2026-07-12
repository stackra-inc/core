/**
 * @file sdui-widget-def.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Contract for a `@SduiWidget()` backend definition.
 *   A widget definition pairs a unique `type` with a target `zone`
 *   plus optional `match()` (filter) and `props()` (server-side
 *   prop preparation) methods.
 *
 *   The matching client-side React component is registered via
 *   `SduiWidgetRegistry.register(type, Component)`.
 */

import type { ISduiWidgetContext } from './sdui-widget-context.interface';

/**
 * Widget definition contract — produced by `@SduiWidget()` classes.
 */
export interface ISduiWidgetDef {
  /** Unique widget type — matches the frontend component registration. */
  readonly type: string;

  /** Target zone — must exist in the `ZoneRegistry` at boot time. */
  readonly zone: string;

  /**
   * Optional filter — decide whether the widget renders for this
   * request. Defaults to "always render".
   */
  match?(ctx: ISduiWidgetContext): boolean | Promise<boolean>;

  /**
   * Optional server-side prop preparation. The returned object is
   * embedded in the scene's `extensions` block; the renderer hands
   * it to the registered React component verbatim.
   */
  props?(
    ctx: ISduiWidgetContext
  ): Readonly<Record<string, unknown>> | Promise<Readonly<Record<string, unknown>>>;
}
