/**
 * @file middleware-stage.enum.ts
 * @module @stackra/ssr/middleware/enums
 * @description The three stages at which middleware can execute.
 *
 *   - `HTTP`  — server-side request/response pipeline (SSR renderer, API routes).
 *   - `UI`    — client-side route transitions (React Router navigations, guards).
 *   - `PIPE`  — generic value pipeline (`@stackra/pipeline` passable transformations).
 *
 *   Stage is used by the resolver to filter middleware chains and by
 *   `defineMiddleware` overloads to infer the correct context shape.
 */

/**
 * Enumeration of middleware execution stages.
 *
 * Stage selection determines which `MiddlewareContext` variant the handler
 * receives at runtime. String literal values (not numeric) — safe to
 * serialize, log, and cross-package compare.
 */
export const MiddlewareStage = {
  /** Server-side HTTP request/response pipeline. */
  HTTP: 'http',
  /** Client-side route transition pipeline. */
  UI: 'ui',
  /** Generic passable-value pipeline. */
  PIPE: 'pipe',
} as const;

/** Union type of every middleware stage literal. */
export type MiddlewareStage = (typeof MiddlewareStage)[keyof typeof MiddlewareStage];
