/**
 * @file route-metadata.interface.ts
 * @module @stackra/ssr/core/server/interfaces
 * @description Metadata payload attached by `@Route()` and `@ApiRoute()`.
 */

import type { MiddlewareDefinition, MiddlewareTuple } from '../../middleware';
import type { HttpMethod, StackraApiHandler } from '../../../react/types/stackra-api-route.type';
import type { MetaTags } from '../../../react/types/meta-tags.type';

/**
 * Metadata attached by the `@Route()` decorator to a class.
 *
 * Discovery picks up decorated classes and constructs a `StackraRoute`
 * from the metadata + instance methods (`.render()` etc).
 */
export interface RouteMetadata {
  /** URL pattern (RRD-compatible: `/users/:id`, `/*`, etc). */
  readonly path: string;
  /**
   * Optional parent path — nests this route under another registered
   * route with the same `path`. Enables discovered route trees without
   * requiring consumers to hand-assemble children arrays.
   */
  readonly parent?: string;
  /** Whether this is the index route for its parent (`{ index: true }`). */
  readonly index?: boolean;
  /** Middleware chain attached to this route. */
  readonly middleware?: readonly (MiddlewareDefinition | string | MiddlewareTuple)[];
  /** SEO tags. */
  readonly meta?: MetaTags;
  /** Free-form handle payload — surfaced via `useMatches()`. */
  readonly handle?: Readonly<Record<string, unknown>>;
}

/**
 * Metadata attached by the `@ApiRoute()` decorator to a class.
 *
 * The decorated class must expose a method named `handle`. Discovery
 * wraps it into a `StackraApiRoute` and registers it with `ApiRouteRegistry`.
 */
export interface ApiRouteMetadata {
  /** URL pattern (matched against `request.url` at request time). */
  readonly path: string;
  /** HTTP method. Defaults to `'GET'`. */
  readonly method?: HttpMethod;
  /** Middleware chain applied before the handler runs. */
  readonly middleware?: readonly (MiddlewareDefinition | string | MiddlewareTuple)[];
  /** Free-form metadata — surfaced in dev tools. */
  readonly meta?: Readonly<Record<string, unknown>>;
  /**
   * When the decorator is applied to a plain function (not a class),
   * the handler is stored directly here — discovery skips container
   * resolution.
   */
  readonly handler?: StackraApiHandler;
}
