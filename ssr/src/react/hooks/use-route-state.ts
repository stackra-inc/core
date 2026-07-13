/**
 * @file use-route-state.ts
 * @module @stackra/ssr/react/hooks
 * @description Read the state that middleware prepared for the current route.
 *
 *   Middleware writes into `ctx.state` during the chain. The attachment
 *   adapter mirrors that state onto `match.handle.middlewareState` so
 *   components can read it here without touching the container.
 *
 *   Named `useRouteState` (not `useMiddlewareState`) — from a component's
 *   perspective this is simply "the state prepared for this route." It
 *   does not collide with React Router's `location.state`.
 */

import { useMatches } from 'react-router-dom';

/**
 * Return the middleware-prepared state for the innermost matched route.
 *
 * @typeParam T - The expected shape of the accumulated state.
 *
 * @example
 * ```typescript
 * interface AuthState { user: User }
 *
 * function DashboardPage() {
 *   const { user } = useRouteState<AuthState>();
 *   return <h1>Hello, {user.name}</h1>;
 * }
 * ```
 */
export function useRouteState<T extends object = Record<string, unknown>>(): T {
  const matches = useMatches();
  const leaf = matches[matches.length - 1];
  const handle = leaf?.handle as { middlewareState?: T } | undefined;
  return (handle?.middlewareState ?? ({} as T)) as T;
}
