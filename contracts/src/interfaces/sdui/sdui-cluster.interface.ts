/**
 * @file sdui-cluster.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Contract for a navigation cluster. A cluster folds a
 *   set of resources under one top-level navigation node — e.g.
 *   "Catalog" containing Products, Categories, and Brands.
 *
 *   Inspired by Filament's cluster feature; the built-in
 *   `ResourceNavigationContributor` reads `cluster: 'catalog'` on a
 *   resource config and emits the resource as a child of the named
 *   cluster.
 */

import type { TranslatableText } from '../../types/sdui/translatable-text.type';

/**
 * Cluster definition registered via `@SduiCluster()`.
 */
export interface ISduiCluster {
  /** Cluster identifier referenced by `IResourceConfig.cluster`. */
  readonly name: string;

  /** Display label rendered in the sidebar. */
  readonly label: TranslatableText;

  /** Icon name resolved by the frontend icon registry. */
  readonly icon?: string;

  /** Display order amongst clusters and top-level resources. */
  readonly order?: number;

  /**
   * Optional default top-level navigation group (e.g. `'admin'`).
   * Falls back to the cluster's own slug when omitted.
   */
  readonly group?: string;
}
