/**
 * @file sdui-navigation-contributor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Specialised contributor that emits navigation items
 *   into the assembled document.
 */

import type { ISduiContributor } from './sdui-contributor.interface';
import type { ISduiContributorContext } from './sdui-contributor-context.interface';
import type { ISduiNavigationItem } from './sdui-navigation-item.interface';

/**
 * Contributor that yields `ISduiNavigationItem` arrays per request.
 *
 * Multiple contributors may be registered; the assembler concatenates
 * their output and deduplicates by `key`. Items are then sorted by
 * `order` and grouped by `group`.
 */
export interface ISduiNavigationContributor extends ISduiContributor<
  readonly ISduiNavigationItem[]
> {
  readonly kind: 'navigation';

  contribute(
    ctx: ISduiContributorContext
  ): readonly ISduiNavigationItem[] | Promise<readonly ISduiNavigationItem[]>;
}
