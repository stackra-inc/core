/**
 * @file seo-config.interface.ts
 * @module @stackra/ssr/core/seo/interfaces
 * @description Site-wide SEO defaults.
 *
 *   Registered under `SEO_CONFIG` by `SeoModule.forRoot(...)`. These
 *   defaults are the base of every merge — route descriptors layer on
 *   top, inner routes winning over outer.
 */

import type { SeoDescriptor } from './seo-descriptor.interface';

/**
 * Site-wide SEO configuration.
 *
 * `defaults` is a `SeoDescriptor` applied as the base layer. `baseUrl`
 * is used to absolutise relative canonical / OpenGraph URLs.
 */
export interface SeoConfig {
  /** Default descriptor applied to every page (title template, og:site_name, ...). */
  readonly defaults?: SeoDescriptor;
  /**
   * Absolute site origin (`https://acme.com`). Relative `canonical` and
   * `og:url` values are resolved against it.
   */
  readonly baseUrl?: string;
}
