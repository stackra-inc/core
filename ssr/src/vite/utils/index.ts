/**
 * @file index.ts
 * @module @stackra/ssr/vite/utils
 * @description Barrel export for Vite plugin helpers.
 */

export { isHtmlRequest } from './is-html-request.util';
export {
  VIRTUAL_ROUTES_ID,
  VIRTUAL_MIDDLEWARE_ID,
  VIRTUAL_PREFIX,
  resolvedId,
  reExportFrom,
  EMPTY_MIDDLEWARE_SOURCE,
} from './virtual-modules.util';
