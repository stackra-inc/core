/**
 * @file sdui-widget-reference.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Serializable widget reference emitted by the assembler
 *   inside `ISduiSceneSlotContent.extensions`. Carries the widget
 *   `type` plus the server-prepared `props`. The renderer looks up
 *   the React component via `SduiWidgetRegistry.get(type)` and
 *   mounts it.
 */

/**
 * Inline reference to a widget the renderer must mount at a zone.
 */
export interface ISduiWidgetReference {
  /** Widget type — matches a `SduiWidgetRegistry.register()` entry. */
  readonly type: string;
  /** Server-prepared props handed to the React component verbatim. */
  readonly props: Readonly<Record<string, unknown>>;
}
