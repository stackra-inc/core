/**
 * @file index.ts
 * @module @stackra/ssr/vite
 * @description Public API surface of the `@stackra/ssr/vite` subpath.
 */

export { stackraSsr } from './plugins';
export type { StackraSsrOptions } from './interfaces';
export { VIRTUAL_ROUTES_ID, VIRTUAL_MIDDLEWARE_ID, isHtmlRequest } from './utils';
