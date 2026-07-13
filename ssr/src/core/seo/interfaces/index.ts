/**
 * @file index.ts
 * @module @stackra/ssr/core/seo/interfaces
 * @description Barrel export for SEO interfaces.
 */

export type { JsonLd } from './json-ld.interface';
export type {
  SeoDescriptor,
  OpenGraphTags,
  OpenGraphImage,
  TwitterTags,
  RobotsDirective,
  AlternateLink,
} from './seo-descriptor.interface';
export type { SeoConfig } from './seo-config.interface';
export type { SeoTag } from './seo-tag.interface';
