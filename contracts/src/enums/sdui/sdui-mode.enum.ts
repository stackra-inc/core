/**
 * @file sdui-mode.enum.ts
 * @module @stackra/contracts/enums/sdui
 * @description The render mode declared by a SDUI document. The
 *   renderer uses this hint to decide where a document lands — full
 *   page, drawer, dialog, sheet, or as an embedded fragment of a
 *   surrounding shell.
 *
 *   Mode is advisory: the router still owns the final routing
 *   decision. Modes are most useful for actions whose `target` opens
 *   a drawer or dialog containing another document.
 */

/**
 * Where a SDUI document should land.
 *
 * - `'page'`   — full-page navigation (default).
 * - `'drawer'` — slide-in panel from the side.
 * - `'dialog'` — centered modal dialog with focus trap.
 * - `'sheet'`  — bottom-sheet on mobile / side-sheet on web.
 * - `'embed'`  — embedded fragment (no layout chrome — used by iframes
 *               and nested documents).
 */
export type SduiMode = 'page' | 'drawer' | 'dialog' | 'sheet' | 'embed';

/**
 * Tuple of every supported mode — useful for Zod enum validation.
 */
export const SDUI_MODES = ['page', 'drawer', 'dialog', 'sheet', 'embed'] as const;
