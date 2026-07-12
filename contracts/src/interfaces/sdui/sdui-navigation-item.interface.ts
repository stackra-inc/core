/**
 * @file sdui-navigation-item.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Navigation item shape produced by SDUI's navigation
 *   contributors. Distinct from `IMenuItem` from
 *   `@stackra/contracts/interfaces/navigation` — that one is the
 *   generic navigation service surface; this one is the document-
 *   embedded shape baked into `meta.navigation` for the renderer.
 */

import type { TranslatableText } from '../../types/sdui/translatable-text.type';

/**
 * One navigation item embedded in an assembled SDUI document.
 */
export interface ISduiNavigationItem {
  /** Stable key — used as React `key` and as the active-item marker. */
  readonly key: string;

  /** Display label. */
  readonly label: TranslatableText;

  /** Optional icon name. */
  readonly icon?: string;

  /** Route the item navigates to (relative path). */
  readonly to?: string;

  /** Optional group / cluster slug. */
  readonly group?: string;

  /** Display order — lower comes first. */
  readonly order?: number;

  /** Optional badge (e.g. unread count). Server-supplied. */
  readonly badge?: TranslatableText;

  /** Optional tag chips rendered below the label. */
  readonly tags?: readonly string[];

  /** Nested children — used for expandable groups. */
  readonly children?: readonly ISduiNavigationItem[];

  /**
   * Permissions required to see the item. The renderer hides it
   * when the actor lacks any of them.
   */
  readonly permissions?: readonly string[];

  /** Feature flags gating the item. */
  readonly featureFlags?: readonly string[];
}
