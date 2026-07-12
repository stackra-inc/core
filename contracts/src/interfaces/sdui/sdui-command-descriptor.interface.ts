/**
 * @file sdui-command-descriptor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Command-palette entry shape. Each entry maps a label
 *   to an action — either a navigation, a SDUI action invocation, or
 *   a free-form command identifier resolved by the renderer.
 */

import type { TranslatableText } from '../../types/sdui/translatable-text.type';
import type { ISduiKbdDescriptor } from './sdui-kbd-descriptor.interface';

/**
 * One command-palette row.
 */
export interface ISduiCommandDescriptor {
  /** Stable key — used by the renderer as React `key`. */
  readonly key: string;

  /** Display label rendered in the palette. */
  readonly label: TranslatableText;

  /** Optional icon name. */
  readonly icon?: string;

  /** Optional group header (e.g. `'Quick actions'`). */
  readonly group?: TranslatableText;

  /**
   * Command identifier. Either a route to navigate to, an action
   * type to invoke, or a custom command name resolved through the
   * frontend command registry.
   */
  readonly command:
    | { readonly type: 'navigate'; readonly to: string }
    | { readonly type: 'action'; readonly actionType: string }
    | {
        readonly type: 'custom';
        readonly name: string;
        readonly args?: Readonly<Record<string, unknown>>;
      };

  /** Optional keyboard shortcut bound to the command. */
  readonly keyboard?: ISduiKbdDescriptor;

  /** Permissions required to see and use the command. */
  readonly permissions?: readonly string[];
}
