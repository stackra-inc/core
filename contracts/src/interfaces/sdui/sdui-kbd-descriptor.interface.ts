/**
 * @file sdui-kbd-descriptor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Keyboard-shortcut descriptor consumed by `@stackra/kbd`.
 *   Documents and actions both emit shortcuts; the renderer registers
 *   them on mount and tears them down on unmount.
 */

/**
 * One keyboard shortcut bound to an SDUI document or action.
 *
 * @example
 * ```ts
 * { id: 'save', keys: 'mod+s', action: { type: 'action', key: 'save' } }
 * { id: 'open-search', keys: 'mod+k', action: { type: 'focus-search' } }
 * ```
 */
export interface ISduiKbdDescriptor {
  /**
   * Stable identifier — used as the key when registering with
   * `@stackra/kbd` so duplicates can be detected.
   */
  readonly id: string;

  /**
   * Key combination in the `@stackra/kbd` syntax (e.g. `'mod+s'`,
   * `'ctrl+shift+f'`, `'esc'`). `mod` resolves to `meta` on macOS
   * and `ctrl` elsewhere.
   */
  readonly keys: string;

  /**
   * Optional human-readable label rendered in the shortcuts panel.
   */
  readonly label?: string;

  /**
   * Action to dispatch when the shortcut fires. The shape is
   * deliberately loose so renderers can plug in custom dispatchers
   * (action invocation, navigation, focus management, …).
   */
  readonly action: { readonly type: string } & Readonly<Record<string, unknown>>;
}
