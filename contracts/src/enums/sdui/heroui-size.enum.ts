/**
 * @file heroui-size.enum.ts
 * @module @stackra/contracts/enums/sdui
 * @description The HeroUI v3 `size` prop set. Components that accept
 *   `size` accept exactly one of these values.
 */

/**
 * HeroUI v3 size scale.
 *
 * - `'sm'` — small / compact (24px - 32px clickable region).
 * - `'md'` — medium / default (32px - 40px).
 * - `'lg'` — large (40px - 48px).
 */
export type HeroUISize = 'sm' | 'md' | 'lg';

/** Tuple of every supported size for Zod enum validation. */
export const HEROUI_SIZES = ['sm', 'md', 'lg'] as const;
