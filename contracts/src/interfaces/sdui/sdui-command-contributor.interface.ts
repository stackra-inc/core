/**
 * @file sdui-command-contributor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Specialised contributor that yields command-palette
 *   entries (`ISduiCommandDescriptor[]`).
 */

import type { ISduiCommandDescriptor } from './sdui-command-descriptor.interface';
import type { ISduiContributor } from './sdui-contributor.interface';
import type { ISduiContributorContext } from './sdui-contributor-context.interface';

/**
 * Contributor that yields command-palette descriptors.
 */
export interface ISduiCommandContributor extends ISduiContributor<
  readonly ISduiCommandDescriptor[]
> {
  readonly kind: 'command';

  contribute(
    ctx: ISduiContributorContext
  ): readonly ISduiCommandDescriptor[] | Promise<readonly ISduiCommandDescriptor[]>;
}
