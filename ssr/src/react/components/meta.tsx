/**
 * @file meta.tsx
 * @module @stackra/ssr/react/components
 * @description Route-driven SEO / AEO head renderer.
 *
 *   Collects every matched route's `handle.seo` descriptor, resolves
 *   them through the container's `SeoService` (which layers site-wide
 *   defaults + merges the chain + builds the tag list), and renders the
 *   resulting tags as React `<head>` elements.
 *
 *   The exact same `SeoService.collect(...)` output is serialized to an
 *   HTML string on the server — one source of truth, two renderers.
 *
 *   Back-compat: routes that still use the lightweight `handle.meta`
 *   (`MetaTags`) are mapped into an `SeoDescriptor` so both keep working.
 */

import { createElement, Fragment, type ReactElement } from 'react';
import { SEO_SERVICE } from '@stackra/contracts';
import { useContainer } from '@stackra/container/react';
import { useMatches } from 'react-router-dom';

import type { SeoService } from '../../core/seo';
import type { SeoDescriptor } from '../../core/seo';
import type { SeoTag } from '../../core/seo';
import type { MetaTags } from '../types/meta-tags.type';

/**
 * Props accepted by `<Meta />`.
 */
export interface MetaProps {
  /**
   * Fallback descriptor applied when no matched route contributes SEO.
   * Layered *below* route descriptors (route wins).
   */
  readonly defaults?: SeoDescriptor;
}

/**
 * Renders the merged SEO payload as `<head>` elements.
 */
export function Meta({ defaults }: MetaProps = {}): ReactElement {
  const container = useContainer();
  const matches = useMatches();

  // Build the descriptor chain (outermost → innermost).
  const chain: SeoDescriptor[] = [];
  if (defaults) chain.push(defaults);
  for (const match of matches) {
    const handle = match.handle as { seo?: SeoDescriptor; meta?: MetaTags } | undefined;
    if (handle?.seo) {
      chain.push(handle.seo);
    } else if (handle?.meta) {
      chain.push(metaTagsToDescriptor(handle.meta));
    }
  }

  const seo = container.get(SEO_SERVICE) as SeoService;
  const tags = seo.collect(chain);

  return createElement(Fragment, null, ...tags.map(renderTag));
}

/**
 * Map a `SeoTag` to a React element.
 */
function renderTag(tag: SeoTag): ReactElement {
  switch (tag.tag) {
    case 'title':
      return createElement('title', { key: tag.key }, tag.text ?? '');
    case 'script':
      return createElement('script', {
        key: tag.key,
        ...tag.attrs,
        dangerouslySetInnerHTML: { __html: tag.text ?? '' },
      });
    default:
      // meta / link — void elements, attributes only.
      return createElement(tag.tag, { key: tag.key, ...tag.attrs });
  }
}

/**
 * Adapt the deprecated `MetaTags` shape into an `SeoDescriptor`.
 */
function metaTagsToDescriptor(meta: MetaTags): SeoDescriptor {
  return {
    title: meta.title,
    description: meta.description,
    canonical: meta.canonical,
    openGraph: meta.og ? { extra: meta.og } : undefined,
    twitter: meta.twitter
      ? {
          card: 'summary',
          title: meta.twitter.title,
          description: meta.twitter.description,
          image: meta.twitter.image,
        }
      : undefined,
    meta: meta.extra ? [...meta.extra] : undefined,
  };
}
