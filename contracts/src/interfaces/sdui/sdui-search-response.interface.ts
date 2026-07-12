/**
 * @file sdui-search-response.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Response body for the global search endpoint.
 *   Results are grouped by resource so the command palette can
 *   render section headers.
 */

import type { TranslatableText } from '../../types/sdui/translatable-text.type';

/**
 * One search hit.
 */
export interface ISduiSearchHit {
  /** Stable identifier — used as React `key`. */
  readonly id: string;
  /** Pre-rendered label from the resource's `resultTemplate`. */
  readonly label: TranslatableText;
  /** Path to navigate to on click. */
  readonly path: string;
  /** Optional secondary text. */
  readonly description?: TranslatableText;
}

/**
 * Group of hits for one resource.
 */
export interface ISduiSearchGroup {
  /** Resource name. */
  readonly resource: string;
  /** Display label for the group header. */
  readonly label: TranslatableText;
  /** Hits within this group. */
  readonly hits: readonly ISduiSearchHit[];
  /** Total hits available beyond `limit`. */
  readonly totalCount?: number;
}

/**
 * Search response envelope.
 */
export interface ISduiSearchResponse {
  /** Groups of hits, ordered by relevance. */
  readonly groups: readonly ISduiSearchGroup[];
  /** Echo of the query that produced these results. */
  readonly q: string;
}
