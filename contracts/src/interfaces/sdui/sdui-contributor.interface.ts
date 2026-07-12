/**
 * @file sdui-contributor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Base contract for every `@SduiContributor()` class.
 *   Contributors plug into the assembler's pipeline and emit content
 *   that flows into the assembled document.
 *
 *   The specialized contributor flavours
 *   (`INavigationContributor`, `IFeatureFlagContributor`, etc.) live
 *   in their own files; this base type carries the discovery surface.
 */

import type { ISduiContributorContext } from './sdui-contributor-context.interface';

/**
 * Tag identifying the contributor's responsibility. The contributor
 * registry indexes by this string; the document assembler queries
 * for everything tagged `'navigation'`, `'feature-flag'`, … when
 * baking each section.
 */
export type SduiContributorKind =
  'navigation' | 'feature-flag' | 'subscription-channel' | 'command' | 'shortcut';

/**
 * Base shape every contributor implements.
 *
 * @typeParam TOutput - The shape of the value the contributor emits
 *   per request (an array of navigation items, an array of flag
 *   keys, …).
 */
export interface ISduiContributor<TOutput = unknown> {
  /**
   * Contributor responsibility — used by `ContributorRegistry` to
   * group contributors when the assembler queries for them.
   */
  readonly kind: SduiContributorKind;

  /**
   * Emit zero or more items for this request. May be sync or async.
   *
   * @param ctx - Per-request context (scope, locale, resource, …).
   * @returns The contribution(s) for this request.
   */
  contribute(ctx: ISduiContributorContext): TOutput | Promise<TOutput>;
}
