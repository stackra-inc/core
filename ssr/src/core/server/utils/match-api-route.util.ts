/**
 * @file match-api-route.util.ts
 * @module @stackra/ssr/core/server/utils
 * @description Path + method matching for `StackraApiRoute` tables.
 *
 *   Uses `URLPattern` when available (modern Node/Bun/Deno/Workers) and
 *   falls back to a minimal path-parser for older Node. The fallback
 *   supports `:param` placeholders which is enough for the current
 *   `StackraApiRoute` contract.
 */

import type { HttpMethod, StackraApiRoute } from '../../../react/types/stackra-api-route.type';

/**
 * Result returned by `matchApiRoute` on a hit.
 */
export interface ApiRouteMatch {
  readonly route: StackraApiRoute;
  readonly params: Record<string, string>;
}

/**
 * Match a request against an API routing table.
 *
 * Returns the first route whose path + method matches. Method comparison
 * is case-insensitive. Path matching supports `:param` placeholders.
 */
export function matchApiRoute(
  routes: readonly StackraApiRoute[],
  request: Request
): ApiRouteMatch | null {
  const url = new URL(request.url);
  const method = request.method.toUpperCase() as HttpMethod;

  for (const route of routes) {
    const expectedMethod = (route.method ?? 'GET').toUpperCase();
    if (expectedMethod !== method) continue;

    const params = matchPath(route.path, url.pathname);
    if (params !== null) {
      return { route, params };
    }
  }
  return null;
}

/**
 * Minimal `:param` path matcher. Returns extracted params on success,
 * or `null` on no match.
 *
 * Not exposed — internal helper.
 */
function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = pathname.split('/').filter(Boolean);

  if (patternSegments.length !== pathSegments.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const expected = patternSegments[i]!;
    const actual = pathSegments[i]!;
    if (expected.startsWith(':')) {
      params[expected.slice(1)] = decodeURIComponent(actual);
    } else if (expected !== actual) {
      return null;
    }
  }
  return params;
}
