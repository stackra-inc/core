/**
 * @file link.tsx
 * @module @stackra/ssr/react/components
 * @description Enhanced `<Link>` with hover/intent prefetching.
 *
 *   Thin wrapper over React Router's `<Link>` that adds a `prefetch`
 *   prop. On hover or focus (`prefetch="hover"` / `"intent"`), we
 *   trigger a background loader fetch so the destination is warm when
 *   the user clicks. `prefetch="render"` prefetches on mount;
 *   `prefetch="none"` disables prefetching entirely.
 *
 *   Uses `useFetcher()` for the actual prefetch — it hits the same
 *   loader chain the router would run on navigation, so the data lands
 *   in the same cache and is picked up transparently.
 */

import { useCallback, useEffect, type ReactNode } from 'react';
import { Link as RRLink, useFetcher, type LinkProps as RRLinkProps } from 'react-router-dom';

/**
 * Prefetch strategy — controls when the destination's loader chain is
 * warmed up.
 *
 * - `'hover'`  — on `mouseenter` / `focus` (the default).
 * - `'intent'` — alias for `'hover'` (Remix convention).
 * - `'render'` — on component mount.
 * - `'none'`   — never.
 */
export type PrefetchStrategy = 'hover' | 'intent' | 'render' | 'none';

/**
 * Props accepted by `<Link>`. Extends every prop from React Router's
 * native `<Link>` with a `prefetch` option.
 */
export interface LinkProps extends Omit<RRLinkProps, 'prefetch'> {
  /** Prefetching strategy. Defaults to `'hover'`. */
  readonly prefetch?: PrefetchStrategy;
  readonly children?: ReactNode;
}

/**
 * Enhanced link component with prefetching.
 */
export function Link({ to, prefetch = 'hover', onMouseEnter, onFocus, ...rest }: LinkProps) {
  const fetcher = useFetcher();

  const doPrefetch = useCallback(() => {
    if (prefetch === 'none') return;
    if (fetcher.state !== 'idle' || fetcher.data !== undefined) return;
    const href = typeof to === 'string' ? to : (to as { pathname: string }).pathname;
    if (!href) return;
    try {
      fetcher.load(href);
    } catch {
      // Prefetch is best-effort — a failure must not break rendering.
    }
  }, [prefetch, fetcher, to]);

  useEffect(() => {
    if (prefetch === 'render') doPrefetch();
    // We want prefetch-on-mount to run exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wantsHoverPrefetch = prefetch === 'hover' || prefetch === 'intent';

  return (
    <RRLink
      to={to}
      {...rest}
      onMouseEnter={(event) => {
        if (wantsHoverPrefetch) doPrefetch();
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        if (wantsHoverPrefetch) doPrefetch();
        onFocus?.(event);
      }}
    />
  );
}
