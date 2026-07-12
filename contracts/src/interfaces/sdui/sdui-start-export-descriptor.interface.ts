/**
 * @file sdui-start-export-descriptor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Trigger descriptor for starting an export flow. Like
 *   `ISduiStartImportDescriptor`, this is purely a trigger that
 *   navigates to `@stackra/data-transfer`'s admin route.
 */

import type { ISduiActionDescriptor } from './sdui-action-descriptor.interface';

/**
 * Loose filter descriptor — concrete shape lives in
 * `@stackra/sdui/nestjs`'s `IFilterDescriptor`. Contracts is
 * intentionally opaque here.
 */
export type SduiInheritedFilters = 'inherit-from-list';
export type SduiInlineFilters = ReadonlyArray<Readonly<Record<string, unknown>>>;

/**
 * Export trigger descriptor.
 */
export interface ISduiStartExportDescriptor extends Omit<ISduiActionDescriptor, 'type'> {
  /** Fixed type — distinguishes export triggers from regular actions. */
  readonly type: 'data-transfer.start-export';

  /** Entity the export targets. */
  readonly entity: string;

  /**
   * Filter source for the export:
   * - `'inherit-from-list'` — copy the current list scene's filters.
   * - inline filter array — explicit filter set.
   */
  readonly filters: SduiInheritedFilters | SduiInlineFilters;

  /**
   * Export scope:
   * - `'all'`      — every record visible to the actor.
   * - `'filtered'` — records matching the current filters.
   * - `'selected'` — only the user's current selection.
   */
  readonly scope: 'all' | 'filtered' | 'selected';
}
