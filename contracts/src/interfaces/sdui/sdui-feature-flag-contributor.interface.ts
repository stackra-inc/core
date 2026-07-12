/**
 * @file sdui-feature-flag-contributor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Specialised contributor that yields the feature flag
 *   keys referenced by the current document. The assembler bakes the
 *   union of all contributions into `meta.featureFlags` so the
 *   renderer can evaluate them client-side via
 *   `@stackra/feature-flags`.
 */

import type { ISduiContributor } from './sdui-contributor.interface';
import type { ISduiContributorContext } from './sdui-contributor-context.interface';

/**
 * Contributor that yields feature-flag keys.
 */
export interface ISduiFeatureFlagContributor extends ISduiContributor<readonly string[]> {
  readonly kind: 'feature-flag';

  contribute(ctx: ISduiContributorContext): readonly string[] | Promise<readonly string[]>;
}
