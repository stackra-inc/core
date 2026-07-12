/**
 * @file heroui-variant.enum.ts
 * @module @stackra/contracts/enums/sdui
 * @description The union of every `variant` value any v3 HeroUI
 *   component accepts.
 *
 *   v3 redesigned the variant system from the v2 single shared set
 *   (`'solid' \| 'flat' \| 'bordered' \| 'light' \| 'faded' \| 'ghost' \| 'shadow'`)
 *   to per-component variant unions. The values vary per component:
 *
 *   - Button:   `'primary' \| 'secondary' \| 'tertiary' \| 'outline' \| 'ghost' \| 'danger'`
 *   - Chip:     `'primary' \| 'secondary' \| 'tertiary' \| 'soft'`
 *   - TrendChip (Pro): `'primary' \| 'secondary' \| 'tertiary' \| 'soft'`
 *   - Badge:    `'primary' \| 'secondary' \| 'soft'`
 *   - Avatar:   `'default' \| 'soft'`
 *   - Card:     `'transparent' \| 'default' \| 'secondary' \| 'tertiary'`
 *   - Many components have no variant prop at all.
 *
 *   `HeroUIVariant` is the **permissive union** of every value above —
 *   builders that don't yet declare a narrow per-component variant
 *   import this type to type their `.variant()` setter. The
 *   recommended v3 pattern is for each builder's descriptor
 *   interface (in `@stackra/sdui/heroui/types.ts` or
 *   `types.ts`) to narrow `variant` to that component's
 *   actual valid set instead of using this loose union.
 *
 *   The v2 values `'solid'`, `'flat'`, `'bordered'`, `'light'`,
 *   `'faded'`, `'shadow'` are NO LONGER VALID anywhere in v3 and
 *   have been removed from this union.
 */

/**
 * Permissive union of every v3 HeroUI variant value across all
 * components. Each component descriptor type should narrow further.
 */
export type HeroUIVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'soft'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'default'
  | 'transparent';

/** Tuple of every supported variant value for Zod enum validation. */
export const HEROUI_VARIANTS = [
  'primary',
  'secondary',
  'tertiary',
  'soft',
  'outline',
  'ghost',
  'danger',
  'default',
  'transparent',
] as const;
