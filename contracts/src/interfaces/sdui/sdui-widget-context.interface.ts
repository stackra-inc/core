/**
 * @file sdui-widget-context.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Runtime context handed to `@SduiWidget()` definition
 *   methods. Mirrors the render-hook context so a widget can decide
 *   whether to render (`match`) and which props to prepare on the
 *   server (`props`).
 */

/**
 * Per-invocation context for a widget definition.
 */
export interface ISduiWidgetContext {
  /** Resource name being assembled. */
  readonly resourceName?: string;
  /** Page name being assembled. */
  readonly pageName?: string;
  /** Scene type the widget is firing inside of. */
  readonly sceneType?: string;
  /** Path params. */
  readonly params: Readonly<Record<string, unknown>>;
  /** Query params. */
  readonly query: Readonly<Record<string, unknown>>;
  /** Scope context. */
  readonly scope: Readonly<Record<string, unknown>>;
  /** Active locale. */
  readonly locale: string;
  /**
   * Authenticated user, loose-typed. Useful for
   * permission-aware widgets that decide via
   * `user.hasPermission?.('xyz')`.
   */
  readonly user?: Readonly<Record<string, unknown>>;
}
