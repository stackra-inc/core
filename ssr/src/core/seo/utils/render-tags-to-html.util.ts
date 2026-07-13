/**
 * @file render-tags-to-html.util.ts
 * @module @stackra/ssr/core/seo/utils
 * @description Serialize a `SeoTag[]` list to an HTML `<head>` fragment.
 *
 *   Used on the server path — the produced string is injected into the
 *   document `<head>`. Attribute values and text content are escaped;
 *   JSON-LD script content uses a JSON-safe escape that neutralises
 *   `</script>` breakouts.
 */

import type { SeoTag } from '../interfaces/seo-tag.interface';

/**
 * Escape a value for use inside a double-quoted HTML attribute.
 */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Escape plain text content (e.g. `<title>`).
 */
function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Escape JSON-LD script content — prevent `</script>` and HTML-comment
 * breakouts while keeping the JSON valid.
 */
function escapeJsonLd(value: string): string {
  return value.replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

/**
 * Render a single tag to an HTML string.
 */
function renderTag(tag: SeoTag): string {
  const attrs = Object.entries(tag.attrs)
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(' ');
  const openAttrs = attrs ? ` ${attrs}` : '';

  switch (tag.tag) {
    case 'title':
      return `<title>${escapeText(tag.text ?? '')}</title>`;
    case 'meta':
      return `<meta${openAttrs} />`;
    case 'link':
      return `<link${openAttrs} />`;
    case 'script':
      return `<script${openAttrs}>${escapeJsonLd(tag.text ?? '')}</script>`;
    default:
      return '';
  }
}

/**
 * Serialize the full tag list to a `<head>` fragment.
 */
export function renderTagsToHtml(tags: readonly SeoTag[]): string {
  return tags.map(renderTag).join('\n');
}
