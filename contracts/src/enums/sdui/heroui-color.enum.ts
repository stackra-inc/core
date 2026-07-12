/**
 * @file heroui-color.enum.ts
 * @module @stackra/contracts/enums/sdui
 * @description The HeroUI v3 `color` prop semantic set. Every builder
 *   that emits a HeroUI `color` field accepts and emits ONLY one of
 *   these five values.
 *
 *   v3 narrowed the v2 color set. The legacy aliases `'primary'` and
 *   `'secondary'` are NO LONGER VALID — the v3 brand color is named
 *   `'accent'`, and there is no `'secondary'` color (use a `variant`
 *   prop on the relevant component instead). Raw hex / OKLCH / RGB
 *   colors are forbidden in SDUI payloads.
 *
 *   Note that NOT every HeroUI component models color via this prop.
 *   Card uses `variant` (semantic prominence). Alert uses `status`
 *   (which accepts the same 5 values). ProgressBar accepts these 5
 *   values via `color`. Always consult the per-component descriptor
 *   in `@stackra/sdui/heroui/types.ts` (or `types.ts`) for
 *   the authoritative prop name.
 */

/**
 * HeroUI v3 semantic color palette (5 values).
 *
 * - `'default'` — neutral grey (the fallback choice).
 * - `'accent'`  — the brand accent color (v3 brand primary).
 * - `'success'` — green status color.
 * - `'warning'` — amber/orange status color.
 * - `'danger'`  — red status color.
 */
export type HeroUIColor = 'default' | 'accent' | 'success' | 'warning' | 'danger';

/** Tuple of every supported color for Zod enum validation. */
export const HEROUI_COLORS = ['default', 'accent', 'success', 'warning', 'danger'] as const;
