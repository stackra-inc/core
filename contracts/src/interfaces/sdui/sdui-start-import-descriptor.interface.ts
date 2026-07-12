/**
 * @file sdui-start-import-descriptor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Trigger descriptor for starting an import flow. SDUI
 *   does NOT implement file picking, column mapping, or progress
 *   tracking — `StartImportAction` is purely a trigger that
 *   navigates to the `@stackra/data-transfer` admin route with the
 *   entity + optional mapping profile as query parameters.
 */

import type { ISduiActionDescriptor } from './sdui-action-descriptor.interface';

/**
 * Import trigger descriptor. Inherits the standard action chrome
 * (label, icon, color, permissions) plus the import-specific fields.
 */
export interface ISduiStartImportDescriptor extends Omit<ISduiActionDescriptor, 'type'> {
  /** Fixed type — distinguishes import triggers from regular actions. */
  readonly type: 'data-transfer.start-import';

  /** Entity the import targets (e.g. `'customer'`, `'product'`). */
  readonly entity: string;

  /**
   * Optional mapping profile slug — references a `MappingProfile`
   * registered with `@stackra/data-transfer`. Pre-fills the column
   * mapping UI on the transfer route.
   */
  readonly mappingProfile?: string;
}
