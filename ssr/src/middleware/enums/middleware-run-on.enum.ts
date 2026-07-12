/**
 * @file middleware-run-on.enum.ts
 * @module @stackra/ssr/middleware/enums
 * @description Environment predicate — controls whether a middleware runs on
 *   the server, the client, or both.
 *
 *   Combined with the current runtime environment (detected at bootstrap and
 *   passed via `RouteResolutionInput.environment`), the resolver filters out
 *   middleware whose `runOn` does not match.
 */

/**
 * Enumeration of middleware environment targets.
 */
export const MiddlewareRunOn = {
  /** Runs only on the server (SSR/render/API). */
  SERVER: 'server',
  /** Runs only on the client (post-hydration, route transitions). */
  CLIENT: 'client',
  /** Runs in both environments — the default. */
  BOTH: 'both',
} as const;

/** Union type of every middleware `runOn` literal. */
export type MiddlewareRunOn = (typeof MiddlewareRunOn)[keyof typeof MiddlewareRunOn];
