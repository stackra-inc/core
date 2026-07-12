/**
 * @file sdui-subscription-channel-contributor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Specialised contributor that yields realtime channel
 *   names. The renderer subscribes to each channel via
 *   `@stackra/realtime` on mount and triggers a soft re-fetch when
 *   any of them emits an invalidation event.
 */

import type { ISduiContributor } from './sdui-contributor.interface';
import type { ISduiContributorContext } from './sdui-contributor-context.interface';

/**
 * Contributor that yields realtime channel names.
 */
export interface ISduiSubscriptionChannelContributor extends ISduiContributor<readonly string[]> {
  readonly kind: 'subscription-channel';

  contribute(ctx: ISduiContributorContext): readonly string[] | Promise<readonly string[]>;
}
