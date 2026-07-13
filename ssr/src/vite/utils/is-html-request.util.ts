/**
 * @file is-html-request.util.ts
 * @module @stackra/ssr/vite/utils
 * @description Detect whether an incoming dev-server request wants an
 *   HTML response.
 *
 *   The Vite plugin only intercepts HTML requests — static asset
 *   requests (`.js`, `.css`, `.svg`, ...) and API requests handled by
 *   another middleware are left for the default pipeline.
 */

import type { IncomingMessage } from 'node:http';

const HTML_MIMES = /text\/html|application\/xhtml\+xml/;

const ASSET_EXTS =
  /\.(?:js|mjs|cjs|jsx|ts|tsx|css|json|map|svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|mp4|webm|wasm|txt|xml|pdf)(?:\?|$)/i;

/**
 * Returns `true` if the request accepts HTML and does not look like a
 * static asset. Skips React Router's internal `.data` requests too.
 */
export function isHtmlRequest(req: IncomingMessage): boolean {
  const url = req.url ?? '/';

  // Static asset by extension.
  if (ASSET_EXTS.test(url)) return false;

  // RRD framework-mode data endpoints.
  if (url.includes('.data')) return false;

  // Vite's internal endpoints.
  if (url.startsWith('/@vite/')) return false;
  if (url.startsWith('/@react-refresh')) return false;
  if (url.startsWith('/@fs/')) return false;
  if (url.startsWith('/node_modules/')) return false;

  const accept = req.headers['accept'];
  const value = Array.isArray(accept) ? accept.join(',') : (accept ?? '');
  if (!value) {
    // No Accept header — treat as an HTML request when the method is GET/HEAD.
    const method = (req.method ?? 'GET').toUpperCase();
    return method === 'GET' || method === 'HEAD';
  }
  return HTML_MIMES.test(value);
}
