/**
 * @file seo-descriptor.interface.ts
 * @module @stackra/ssr/core/seo/interfaces
 * @description The per-route SEO descriptor.
 *
 *   Routes attach an `seo` descriptor to their `handle`. The `SeoService`
 *   merges descriptors along the match chain (inner overrides outer),
 *   applies site-wide defaults, and produces a flat list of head tags.
 *   The same tag list is rendered as React elements on the client
 *   (`<Meta>`) and serialized to an HTML string on the server.
 */

import type { JsonLd } from './json-ld.interface';

/**
 * OpenGraph metadata (`og:*`). Rendered as `<meta property="og:...">`.
 */
export interface OpenGraphTags {
  readonly title?: string;
  readonly description?: string;
  readonly type?: string; // website, article, product, ...
  readonly url?: string;
  readonly siteName?: string;
  readonly locale?: string;
  readonly images?: readonly OpenGraphImage[];
  /** Any extra `og:*` keys not covered above. */
  readonly extra?: Readonly<Record<string, string>>;
}

/** OpenGraph image descriptor. */
export interface OpenGraphImage {
  readonly url: string;
  readonly alt?: string;
  readonly width?: number;
  readonly height?: number;
  readonly type?: string;
}

/**
 * Twitter card metadata (`twitter:*`). Rendered as `<meta name="twitter:...">`.
 */
export interface TwitterTags {
  readonly card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  readonly site?: string;
  readonly creator?: string;
  readonly title?: string;
  readonly description?: string;
  readonly image?: string;
  readonly imageAlt?: string;
}

/**
 * Robots directive. Either a raw string (`'index, follow'`) or a
 * structured object that the service serializes.
 */
export type RobotsDirective =
  | string
  | {
      readonly index?: boolean;
      readonly follow?: boolean;
      readonly noarchive?: boolean;
      readonly nosnippet?: boolean;
      readonly maxSnippet?: number;
      readonly maxImagePreview?: 'none' | 'standard' | 'large';
    };

/**
 * Alternate-language link (`<link rel="alternate" hreflang="...">`).
 */
export interface AlternateLink {
  readonly hreflang: string;
  readonly href: string;
}

/**
 * The per-route SEO descriptor.
 *
 * Every field is optional; missing fields inherit from ancestor routes
 * and finally from the site-wide `SeoConfig` defaults.
 */
export interface SeoDescriptor {
  /** Page title. Combined with `titleTemplate` from defaults if present. */
  readonly title?: string;
  /**
   * Template for the title, e.g. `'%s | Acme'`. When a route sets
   * `title`, the resolved `<title>` becomes `template.replace('%s', title)`.
   * A route can override the inherited template.
   */
  readonly titleTemplate?: string;
  /** Meta description. */
  readonly description?: string;
  /** Canonical URL — `<link rel="canonical">`. */
  readonly canonical?: string;
  /** Robots directive. */
  readonly robots?: RobotsDirective;
  /** Keywords — joined into a single `<meta name="keywords">`. */
  readonly keywords?: readonly string[];
  /** OpenGraph tags. */
  readonly openGraph?: OpenGraphTags;
  /** Twitter card tags. */
  readonly twitter?: TwitterTags;
  /**
   * Schema.org JSON-LD — one document or many. Emitted as one or more
   * `<script type="application/ld+json">` blocks. Accumulates down the
   * match chain (children append, they don't replace).
   */
  readonly jsonLd?: JsonLd | readonly JsonLd[];
  /** Alternate-language links. */
  readonly alternates?: readonly AlternateLink[];
  /** Arbitrary extra `<meta>` tags. */
  readonly meta?: readonly Readonly<Record<string, string>>[];
}
