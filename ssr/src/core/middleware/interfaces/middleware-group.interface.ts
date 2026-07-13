/**
 * @file middleware-group.interface.ts
 * @module @stackra/ssr/middleware/interfaces
 * @description Named collection of middleware referenced from routes.
 */

import type { MiddlewareDefinition } from '../types/middleware-definition.type';

/**
 * A named bundle of middleware — resolved as a unit when its name is
 * referenced in a route table or another group's `middleware` array.
 *
 * Group names must begin with `@` (validated at the type level by the
 * `defineMiddlewareGroup` helper). Reserved built-in groups: `@web`,
 * `@api`, `@guest`, `@auth`.
 */
export interface MiddlewareGroup {
  /** Group name — must start with `@`. */
  readonly name: `@${string}`;

  /**
   * Members of the group. Each entry is either a `MiddlewareDefinition`
   * (function / options / class) or a string referencing another named
   * middleware in the registry.
   */
  readonly middleware: readonly (MiddlewareDefinition | string)[];

  /** Free-form description. */
  readonly description?: string;
}
