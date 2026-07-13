/**
 * @file ssr.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by the `@stackra/ssr` runtime.
 *
 *   Emitted on the `EVENT_EMITTER` bus (registered as `@Optional` — fail
 *   soft when events package is absent). Constants live in contracts so
 *   dashboards, audit logs, and metrics collectors can subscribe without
 *   depending on `@stackra/ssr`.
 */

/**
 * SSR lifecycle event names.
 *
 * Payload shapes:
 * - `RENDER_STARTED`     — `{ url: string; method: string; isCrawler: boolean }`
 * - `RENDER_COMPLETED`   — `{ url: string; status: number; durationMs: number }`
 * - `RENDER_FAILED`      — `{ url: string; error: Error }`
 * - `ROUTE_MATCHED`      — `{ url: string; matchedPath: string; params: Record<string, string> }`
 * - `API_ROUTE_MATCHED`  — `{ url: string; method: string; path: string }`
 * - `ROUTE_REGISTERED`   — `{ path: string; source: 'config' | 'discovery' }`
 */
export const SSR_EVENTS = {
  /** A request began the render pipeline. */
  RENDER_STARTED: 'ssr.render.started',
  /** A request finished rendering. */
  RENDER_COMPLETED: 'ssr.render.completed',
  /** A request failed during rendering. */
  RENDER_FAILED: 'ssr.render.failed',
  /** A UI route matched the incoming request. */
  ROUTE_MATCHED: 'ssr.route.matched',
  /** An API route matched the incoming request. */
  API_ROUTE_MATCHED: 'ssr.api-route.matched',
  /** A route was registered (either from config or discovery). */
  ROUTE_REGISTERED: 'ssr.route.registered',
} as const;

/** Union type of every emitted SSR event name. */
export type SsrEventName = (typeof SSR_EVENTS)[keyof typeof SSR_EVENTS];
