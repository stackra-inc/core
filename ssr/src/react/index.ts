/**
 * @file index.ts
 * @module @stackra/ssr/react
 * @description Public API surface of the `@stackra/ssr/react` subpath.
 *
 *   Everything a client-side app needs: route + API primitives, the
 *   `<StackraRouter>` entry component, `<Link>` and `<Meta>` helpers,
 *   and hooks (`useRouteState`, `useContainer`, plus curated RRD re-exports).
 */

// ═══════════════════════════════════════════════════════════════════════
// Primitives
// ═══════════════════════════════════════════════════════════════════════
export { defineRoutes, defineApiRoute, attachMiddleware } from './utils';
export type { AttachEnvironment } from './utils';

// ═══════════════════════════════════════════════════════════════════════
// Components
// ═══════════════════════════════════════════════════════════════════════
export { StackraRouter, Link, Meta } from './components';
export type { StackraRouterProps, LinkProps, PrefetchStrategy, MetaProps } from './components';

// ═══════════════════════════════════════════════════════════════════════
// Hooks
// ═══════════════════════════════════════════════════════════════════════
export * from './hooks';

// ═══════════════════════════════════════════════════════════════════════
// SEO builders — re-exported so route files import everything from
// `@stackra/ssr/react`.
// ═══════════════════════════════════════════════════════════════════════
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
} from '../core/seo';
export type {
  SeoDescriptor,
  OpenGraphTags,
  OpenGraphImage,
  TwitterTags,
  RobotsDirective,
  AlternateLink,
  JsonLd,
} from '../core/seo';

// ═══════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════
export type {
  MetaTags,
  StackraRoute,
  StackraRouteHandle,
  StackraApiRoute,
  StackraApiHandler,
  HttpMethod,
} from './types';
