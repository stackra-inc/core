/**
 * @file route-resolution-input.interface.ts
 * @module @stackra/ssr/middleware/interfaces
 * @description Input payload for `MiddlewareResolver.resolve(...)`.
 */

import type { MiddlewareRunOn } from '../enums/middleware-run-on.enum';
import type { MiddlewareStage } from '../enums/middleware-stage.enum';
import type { MiddlewareDefinition } from '../types/middleware-definition.type';

/**
 * Runtime input the resolver reads to produce the final ordered chain.
 *
 * The resolver combines three sources of middleware:
 *   - `global`  — cross-cutting definitions registered at the module level.
 *   - `groups`  — expanded by name from the group registry.
 *   - `route`   — route-attached definitions and references.
 *
 * Combined with the current environment and stage, it walks the constraint
 * DAG and emits a `ResolvedMiddleware[]` array.
 */
export interface RouteResolutionInput {
  /** Global middleware — always considered before groups and route. */
  readonly global?: readonly (MiddlewareDefinition | string)[];

  /**
   * Group references. Each entry must start with `@` and match a
   * registered group. Unknown groups raise
   * `MIDDLEWARE_UNKNOWN_REFERENCE`.
   */
  readonly groups?: readonly `@${string}`[];

  /** Route-attached middleware. */
  readonly route?: readonly (MiddlewareDefinition | string)[];

  /**
   * The environment we're resolving for. Controls the `runOn` filter.
   * Typically inferred by the caller from `typeof window`.
   */
  readonly environment: Extract<MiddlewareRunOn, 'server' | 'client'>;

  /**
   * The stage we're resolving for. Filters middleware whose `stage`
   * doesn't match.
   */
  readonly stage: MiddlewareStage;
}
