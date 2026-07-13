/**
 * @file merge-config.util.ts
 * @module @stackra/ssr/core/server/utils
 * @description Merges caller-supplied `SsrModuleOptions` with the
 *   canonical defaults from `DEFAULT_SSR_CONFIG`.
 */

import { DEFAULT_SSR_CONFIG } from '../constants/default-ssr-config.constant';
import type { SsrModuleOptions } from '../interfaces/ssr-module-options.interface';

/**
 * Deep-ish merge — arrays replace rather than append (predictable
 * behaviour), primitive fields fall back to defaults when the caller
 * omits them.
 *
 * @param options - Caller-supplied options (may be partial or absent)
 * @returns Fully-populated `SsrModuleOptions`
 */
export function mergeConfig(options?: SsrModuleOptions): SsrModuleOptions {
  if (!options) {
    return { ...DEFAULT_SSR_CONFIG };
  }
  return {
    routes: options.routes ?? DEFAULT_SSR_CONFIG.routes ?? [],
    apiRoutes: options.apiRoutes ?? DEFAULT_SSR_CONFIG.apiRoutes ?? [],
    globalMiddleware: options.globalMiddleware ?? DEFAULT_SSR_CONFIG.globalMiddleware ?? [],
    globalGroups: options.globalGroups ?? DEFAULT_SSR_CONFIG.globalGroups ?? [],
    clientEntry: options.clientEntry ?? DEFAULT_SSR_CONFIG.clientEntry,
    clientCss: options.clientCss ?? DEFAULT_SSR_CONFIG.clientCss,
    isCrawler: options.isCrawler ?? DEFAULT_SSR_CONFIG.isCrawler,
    force: options.force ?? DEFAULT_SSR_CONFIG.force,
    exposeErrors: options.exposeErrors ?? DEFAULT_SSR_CONFIG.exposeErrors ?? false,
    renderShell: options.renderShell ?? DEFAULT_SSR_CONFIG.renderShell,
  };
}
