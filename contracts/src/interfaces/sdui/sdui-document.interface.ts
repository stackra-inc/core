/**
 * @file sdui-document.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description The top-level SDUI document envelope. Every screen in
 *   the system — admin list, public landing page, mobile POS — is
 *   described as one of these objects. The renderer is a pure
 *   pass-through.
 */

import type { SduiMode } from '../../enums/sdui/sdui-mode.enum';
import type { ISduiDocumentMeta } from './sdui-document-meta.interface';
import type { ISduiLayoutRef } from './sdui-layout-ref.interface';
import type { SduiSlotContent } from './sdui-slot-content.interface';

/**
 * The top-level SDUI document.
 *
 * @example Minimal landing page
 * ```ts
 * const doc: ISduiDocument = {
 *   layout: { name: 'landing' },
 *   slots: { main: { kind: 'tree', root: pageTree } },
 *   meta:  { title: { key: 'home.title' } },
 * };
 * ```
 *
 * @example Admin list page
 * ```ts
 * const doc: ISduiDocument = {
 *   resource: 'order',
 *   layout: { name: 'app', options: { sidebarCollapsible: 'icon' } },
 *   slots: {
 *     sidebar: { kind: 'scene', type: 'sidebar', config },
 *     navbar:  { kind: 'scene', type: 'navbar',  config },
 *     main:    { kind: 'scene', type: 'list',    config },
 *   },
 *   meta: { title: { key: 'order.plural' }, permissions: ['orders.view'] },
 * };
 * ```
 */
export interface ISduiDocument {
  /**
   * Optional resource binding. Pure pages (landing, auth) omit this.
   * When present, refers to the registered resource that produced the
   * document and is used as part of the cache key.
   */
  readonly resource?: string;

  /**
   * Render mode. The router uses this hint to decide where the
   * document lands (full page, drawer, dialog, sheet, embed).
   */
  readonly mode?: SduiMode;

  /**
   * Layout reference. Resolved by `LayoutRegistry` to a renderer
   * component. Options are layout-specific.
   */
  readonly layout: ISduiLayoutRef;

  /**
   * Slot content keyed by slot name declared by the layout. A slot
   * may carry either a single `SduiSlotContent` (single-value slots)
   * or an array of them (multi-value stackable slots like `drawer`,
   * `modal`, `toast`).
   */
  readonly slots: Readonly<Record<string, SduiSlotContent | readonly SduiSlotContent[]>>;

  /** Document-level metadata. */
  readonly meta: ISduiDocumentMeta;
}
