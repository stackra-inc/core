/**
 * @file seo-tag.interface.ts
 * @module @stackra/ssr/core/seo/interfaces
 * @description Neutral tag descriptor produced by the SEO builder.
 *
 *   The builder turns a resolved `SeoDescriptor` into a flat list of
 *   `SeoTag`s. This intermediate representation is framework-neutral:
 *   `<Meta>` maps each tag to a React element, and the server maps each
 *   to an HTML string — one source of truth, two renderers.
 */

/**
 * A single head tag.
 *
 * - `tag`   — the element name (`title`, `meta`, `link`, `script`).
 * - `attrs` — attributes to set.
 * - `text`  — inner text (used by `title` and JSON-LD `script`).
 * - `key`   — stable React key + server dedupe key.
 */
export interface SeoTag {
  readonly tag: 'title' | 'meta' | 'link' | 'script';
  readonly attrs: Readonly<Record<string, string>>;
  readonly text?: string;
  readonly key: string;
}
