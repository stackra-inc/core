/**
 * @file resolved-middleware.interface.ts
 * @module @stackra/ssr/middleware/interfaces
 * @description Shape produced by `MiddlewareResolver.resolve(...)`.
 */

import type { MiddlewareRunOn } from '../enums/middleware-run-on.enum';
import type { MiddlewareStage } from '../enums/middleware-stage.enum';
import type { MiddlewareDefinition } from '../types/middleware-definition.type';

/**
 * A middleware entry after the resolver has:
 *   1. Filtered by environment + stage + enabled predicate.
 *   2. Reified string references against the registry.
 *   3. Sorted by priority + declaration order + `dependsOn` DAG.
 *
 * The `definition` field holds the fully materialized definition ready to
 * hand to `toPipe(...)`. Extra metadata (`priority`, `stage`, ...) is
 * preserved for dev-tools introspection.
 */
export interface ResolvedMiddleware {
  /** Materialized middleware definition. */
  readonly definition: MiddlewareDefinition;
  /** Resolved name — empty string for anonymous entries. */
  readonly name: string;
  /** Effective priority after defaults. */
  readonly priority: number;
  /** Effective stage after defaults. */
  readonly stage: MiddlewareStage;
  /** Effective `runOn` after defaults. */
  readonly runOn: MiddlewareRunOn;
  /**
   * Source label for debugging — `'global'`, `'group:@web'`, `'route'`,
   * or `'ref:name'`.
   */
  readonly source: string;
}
