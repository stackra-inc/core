/**
 * @file sdui-shortcut-contributor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Specialised contributor that yields keyboard shortcuts
 *   the renderer registers with `@stackra/kbd` on mount.
 */

import type { ISduiContributor } from './sdui-contributor.interface';
import type { ISduiContributorContext } from './sdui-contributor-context.interface';
import type { ISduiKbdDescriptor } from './sdui-kbd-descriptor.interface';

/**
 * Contributor that yields keyboard-shortcut descriptors.
 */
export interface ISduiShortcutContributor extends ISduiContributor<readonly ISduiKbdDescriptor[]> {
  readonly kind: 'shortcut';

  contribute(
    ctx: ISduiContributorContext
  ): readonly ISduiKbdDescriptor[] | Promise<readonly ISduiKbdDescriptor[]>;
}
