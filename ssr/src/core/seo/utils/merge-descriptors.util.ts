/**
 * @file merge-descriptors.util.ts
 * @module @stackra/ssr/core/seo/utils
 * @description Merge a chain of SEO descriptors into one resolved descriptor.
 *
 *   Merge rules:
 *   - Scalars (`title`, `description`, `canonical`, `robots`,
 *     `titleTemplate`) — inner (later) wins.
 *   - `openGraph` / `twitter` — shallow-merged one level deep.
 *   - `jsonLd` — accumulated (children append; nothing is dropped).
 *   - `keywords` / `alternates` / `meta` — concatenated + de-duped.
 */

import type { JsonLd } from '../interfaces/json-ld.interface';
import type { SeoDescriptor } from '../interfaces/seo-descriptor.interface';

/** Normalise a `jsonLd` field (single or array) to an array. */
function toJsonLdArray(value: SeoDescriptor['jsonLd']): JsonLd[] {
  if (!value) return [];
  return Array.isArray(value) ? [...value] : [value as JsonLd];
}

/**
 * Merge an ordered chain of descriptors (outermost first) into a single
 * resolved descriptor.
 */
export function mergeDescriptors(chain: readonly SeoDescriptor[]): SeoDescriptor {
  let result: SeoDescriptor = {};
  const jsonLd: JsonLd[] = [];
  let keywords: string[] = [];
  let alternates: SeoDescriptor['alternates'] = [];
  let meta: NonNullable<SeoDescriptor['meta']>[number][] = [];

  for (const desc of chain) {
    result = {
      ...result,
      ...desc,
      openGraph: { ...(result.openGraph ?? {}), ...(desc.openGraph ?? {}) },
      twitter: { ...(result.twitter ?? {}), ...(desc.twitter ?? {}) },
    };
    jsonLd.push(...toJsonLdArray(desc.jsonLd));
    if (desc.keywords) keywords.push(...desc.keywords);
    if (desc.alternates) alternates = [...(alternates ?? []), ...desc.alternates];
    if (desc.meta) meta = [...meta, ...desc.meta];
  }

  // De-dupe keywords preserving order.
  keywords = [...new Set(keywords)];

  return {
    ...result,
    ...(jsonLd.length > 0 ? { jsonLd } : {}),
    ...(keywords.length > 0 ? { keywords } : {}),
    ...(alternates && alternates.length > 0 ? { alternates } : {}),
    ...(meta.length > 0 ? { meta } : {}),
  };
}
