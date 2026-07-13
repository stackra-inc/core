/**
 * @file build-seo-tags.util.ts
 * @module @stackra/ssr/core/seo/utils
 * @description Turn a resolved `SeoDescriptor` into a flat `SeoTag[]`.
 *
 *   Framework-neutral output — the same tag list feeds the React
 *   `<Meta>` component and the server-side HTML serializer.
 */

import type { JsonLd } from '../interfaces/json-ld.interface';
import type { RobotsDirective, SeoDescriptor } from '../interfaces/seo-descriptor.interface';
import type { SeoTag } from '../interfaces/seo-tag.interface';

/**
 * Resolve the `<title>` string, applying `titleTemplate` if present.
 */
function resolveTitle(desc: SeoDescriptor): string | undefined {
  if (!desc.title) return undefined;
  if (desc.titleTemplate && desc.titleTemplate.includes('%s')) {
    return desc.titleTemplate.replace('%s', desc.title);
  }
  return desc.title;
}

/**
 * Serialize a robots directive to its `content` string.
 */
function resolveRobots(robots: RobotsDirective): string {
  if (typeof robots === 'string') return robots;
  const parts: string[] = [];
  parts.push(robots.index === false ? 'noindex' : 'index');
  parts.push(robots.follow === false ? 'nofollow' : 'follow');
  if (robots.noarchive) parts.push('noarchive');
  if (robots.nosnippet) parts.push('nosnippet');
  if (typeof robots.maxSnippet === 'number') parts.push(`max-snippet:${robots.maxSnippet}`);
  if (robots.maxImagePreview) parts.push(`max-image-preview:${robots.maxImagePreview}`);
  return parts.join(', ');
}

/**
 * Absolutise a possibly-relative URL against `baseUrl`.
 */
function absolutise(url: string | undefined, baseUrl?: string): string | undefined {
  if (!url) return undefined;
  if (!baseUrl) return url;
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

/**
 * Build the flat tag list from a resolved descriptor.
 *
 * @param desc    - The merged descriptor.
 * @param baseUrl - Optional origin used to absolutise canonical / og:url.
 */
export function buildSeoTags(desc: SeoDescriptor, baseUrl?: string): SeoTag[] {
  const tags: SeoTag[] = [];

  const title = resolveTitle(desc);
  if (title) {
    tags.push({ tag: 'title', attrs: {}, text: title, key: 'title' });
  }

  if (desc.description) {
    tags.push({
      tag: 'meta',
      attrs: { name: 'description', content: desc.description },
      key: 'desc',
    });
  }

  if (desc.keywords && desc.keywords.length > 0) {
    tags.push({
      tag: 'meta',
      attrs: { name: 'keywords', content: desc.keywords.join(', ') },
      key: 'keywords',
    });
  }

  if (desc.robots) {
    tags.push({
      tag: 'meta',
      attrs: { name: 'robots', content: resolveRobots(desc.robots) },
      key: 'robots',
    });
  }

  const canonical = absolutise(desc.canonical, baseUrl);
  if (canonical) {
    tags.push({ tag: 'link', attrs: { rel: 'canonical', href: canonical }, key: 'canonical' });
  }

  // OpenGraph -----------------------------------------------------------
  const og = desc.openGraph;
  if (og) {
    pushOg(tags, 'title', og.title);
    pushOg(tags, 'description', og.description);
    pushOg(tags, 'type', og.type);
    pushOg(tags, 'url', absolutise(og.url, baseUrl));
    pushOg(tags, 'site_name', og.siteName);
    pushOg(tags, 'locale', og.locale);
    for (const [i, image] of (og.images ?? []).entries()) {
      pushOg(tags, 'image', absolutise(image.url, baseUrl), `og:image:${i}`);
      if (image.alt) pushOg(tags, 'image:alt', image.alt, `og:image:alt:${i}`);
      if (image.width) pushOg(tags, 'image:width', String(image.width), `og:image:w:${i}`);
      if (image.height) pushOg(tags, 'image:height', String(image.height), `og:image:h:${i}`);
      if (image.type) pushOg(tags, 'image:type', image.type, `og:image:t:${i}`);
    }
    for (const [key, value] of Object.entries(og.extra ?? {})) {
      pushOg(tags, key, value, `og:extra:${key}`);
    }
  }

  // Twitter -------------------------------------------------------------
  const tw = desc.twitter;
  if (tw) {
    pushTwitter(tags, 'card', tw.card);
    pushTwitter(tags, 'site', tw.site);
    pushTwitter(tags, 'creator', tw.creator);
    pushTwitter(tags, 'title', tw.title);
    pushTwitter(tags, 'description', tw.description);
    pushTwitter(tags, 'image', absolutise(tw.image, baseUrl));
    pushTwitter(tags, 'image:alt', tw.imageAlt);
  }

  // Alternates ----------------------------------------------------------
  for (const [i, alt] of (desc.alternates ?? []).entries()) {
    tags.push({
      tag: 'link',
      attrs: {
        rel: 'alternate',
        hreflang: alt.hreflang,
        href: absolutise(alt.href, baseUrl) ?? alt.href,
      },
      key: `alt:${i}`,
    });
  }

  // Extra meta ----------------------------------------------------------
  for (const [i, m] of (desc.meta ?? []).entries()) {
    tags.push({ tag: 'meta', attrs: m, key: `meta:${i}` });
  }

  // JSON-LD -------------------------------------------------------------
  const jsonLd = normaliseJsonLd(desc.jsonLd);
  for (const [i, doc] of jsonLd.entries()) {
    tags.push({
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      text: JSON.stringify(withContext(doc)),
      key: `jsonld:${i}`,
    });
  }

  return tags;
}

function pushOg(tags: SeoTag[], key: string, value: string | undefined, dedupeKey?: string): void {
  if (!value) return;
  tags.push({
    tag: 'meta',
    attrs: { property: `og:${key}`, content: value },
    key: dedupeKey ?? `og:${key}`,
  });
}

function pushTwitter(tags: SeoTag[], key: string, value: string | undefined): void {
  if (!value) return;
  tags.push({
    tag: 'meta',
    attrs: { name: `twitter:${key}`, content: value },
    key: `twitter:${key}`,
  });
}

function normaliseJsonLd(value: SeoDescriptor['jsonLd']): JsonLd[] {
  if (!value) return [];
  return Array.isArray(value) ? [...value] : [value as JsonLd];
}

function withContext(doc: JsonLd): JsonLd {
  return doc['@context'] ? doc : { '@context': 'https://schema.org', ...doc };
}
