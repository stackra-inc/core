/**
 * @file meta-tags.type.ts
 * @module @stackra/ssr/react/types
 * @description Shape of the `meta` handle attached to routes.
 *
 *   The `<Meta />` component walks the current match tree, collects every
 *   route's `handle.meta`, and merges deep-first — inner routes override
 *   outer routes.
 */

/**
 * SEO-relevant tag payload for a route.
 *
 * All fields are optional. Missing fields fall through to shallower
 * routes and finally to the `defaultMeta` supplied to `<StackraRouter>`.
 */
export interface MetaTags {
  /** Rendered as `<title>...</title>`. */
  readonly title?: string;
  /** Rendered as `<meta name="description" content="...">`. */
  readonly description?: string;
  /**
   * OpenGraph tags — rendered as `<meta property="og:${key}" content="${value}">`.
   * Common keys: `title`, `description`, `image`, `url`, `type`, `site_name`.
   */
  readonly og?: Readonly<Record<string, string>>;
  /**
   * Twitter card tags — rendered as `<meta name="twitter:${key}" content="${value}">`.
   * Common keys: `card`, `site`, `creator`, `title`, `description`, `image`.
   */
  readonly twitter?: Readonly<Record<string, string>>;
  /** Rendered as `<link rel="canonical" href="...">`. */
  readonly canonical?: string;
  /**
   * Arbitrary extra `<meta>` tags — rendered verbatim.
   *
   * `[{ name: 'robots', content: 'noindex' }, { property: 'article:author', content: 'Jane' }]`
   */
  readonly extra?: readonly Readonly<Record<string, string>>[];
}
