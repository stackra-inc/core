/**
 * @file index.ts
 * @module @stackra/ssr/core/seo
 * @description Public API surface of the SEO subsystem.
 */

// ═══════════════════════════════════════════════════════════════════════
// Module + service
// ═══════════════════════════════════════════════════════════════════════
export { SeoModule } from './seo.module';
export { SeoService } from './services';

// ═══════════════════════════════════════════════════════════════════════
// Builders + utilities
// ═══════════════════════════════════════════════════════════════════════
export {
  mergeDescriptors,
  buildSeoTags,
  renderTagsToHtml,
  organization,
  website,
  webPage,
  breadcrumbList,
  article,
  product,
  faqPage,
  qaPage,
  speakable,
} from './utils';

// ═══════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════
export { DEFAULT_SEO_CONFIG } from './constants';

// ═══════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════
export type {
  JsonLd,
  SeoDescriptor,
  OpenGraphTags,
  OpenGraphImage,
  TwitterTags,
  RobotsDirective,
  AlternateLink,
  SeoConfig,
  SeoTag,
} from './interfaces';
