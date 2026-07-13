/**
 * @file default-seo-config.constant.ts
 * @module @stackra/ssr/core/seo/constants
 * @description Canonical default value for `SeoConfig`.
 */

import type { SeoConfig } from '../interfaces/seo-config.interface';

/**
 * Default SEO configuration — empty defaults, no base URL. Everything
 * comes from route descriptors unless the consumer provides site-wide
 * defaults via `SeoModule.forRoot({...})`.
 */
export const DEFAULT_SEO_CONFIG: SeoConfig = {
  defaults: {},
};
