/**
 * @file sdui-render-hook-contributor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Contract for a backend render-hook contributor.
 *   Render hooks are server-side extensions that return a
 *   `SduiSlotContent` inline at a registered zone. Cacheable as part
 *   of the assembled document (unlike widgets, which render on the
 *   client).
 */

import type { ISduiRenderHookContext } from './sdui-render-hook-context.interface';
import type { SduiSlotContent } from './sdui-slot-content.interface';

/**
 * Contract for `@SduiRenderHook({ zone, resource?, view? })` classes.
 */
export interface ISduiRenderHookContributor {
  /**
   * Zone the contributor targets. Must be present in the
   * `ZoneRegistry` at boot time.
   */
  readonly zone: string;

  /**
   * Optional resource scoping — when set, the hook only fires for
   * the named resource's scenes.
   */
  readonly resource?: string;

  /**
   * Optional view scoping — when set, the hook only fires for the
   * named view (`'list'`, `'show'`, …).
   */
  readonly view?: string;

  /**
   * Build the slot content to inject at the zone. Return `null` to
   * decline (e.g. the current user lacks the relevant permission).
   */
  contribute(ctx: ISduiRenderHookContext): Promise<SduiSlotContent | null> | SduiSlotContent | null;
}
