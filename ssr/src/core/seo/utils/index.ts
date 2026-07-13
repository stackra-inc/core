/**
 * @file index.ts
 * @module @stackra/ssr/core/seo/utils
 * @description Barrel export for SEO utilities.
 */

export { mergeDescriptors } from './merge-descriptors.util';
export { buildSeoTags } from './build-seo-tags.util';
export { renderTagsToHtml } from './render-tags-to-html.util';

// JSON-LD builders — grouped under a namespace-friendly re-export.
export {
  organization,
  website,
  webPage,
  breadcrumbList,
  article,
  product,
  faqPage,
  qaPage,
  speakable,
} from './json-ld.util';
