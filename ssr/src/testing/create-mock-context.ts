/**
 * @file create-mock-context.ts
 * @module @stackra/ssr/testing
 * @description Test helper that produces stage-appropriate mock contexts.
 */

import type { HttpContext, PipeContext, UiContext } from '../core/middleware/interfaces';
import type { MiddlewareDefinition } from '../core/middleware/types/middleware-definition.type';
import type { MiddlewareNext } from '../core/middleware/types/middleware-next.type';
import { runMiddleware } from './run-middleware';
import { createMockContainer } from './mock-container';
import type { MockContainer } from './mock-container';

/**
 * Overrides accepted by `createMockContext` — a partial version of the
 * stage-specific context shape.
 */
export type ContextOverrides<TStage extends 'http' | 'ui' | 'pipe'> = TStage extends 'http'
  ? Partial<HttpContext>
  : TStage extends 'ui'
    ? Partial<UiContext>
    : Partial<PipeContext>;

/**
 * Returned mock context — includes the standard fields plus a
 * `runMiddleware()` helper for concise assertions.
 */
export type MockContext<TStage extends 'http' | 'ui' | 'pipe'> = (TStage extends 'http'
  ? HttpContext
  : TStage extends 'ui'
    ? UiContext
    : PipeContext) & {
  container: MockContainer;
  runMiddleware(middleware: MiddlewareDefinition, next?: MiddlewareNext): Promise<unknown>;
};

/**
 * Create a stage-appropriate mock context populated with sensible
 * defaults. Overrides are applied last-wins.
 *
 * @example
 * ```typescript
 * const ctx = createMockContext('http', {
 *   request: new Request('https://example.test/users/42'),
 *   params: { id: '42' },
 * });
 * const result = await ctx.runMiddleware(requireAuth);
 * ```
 */
export function createMockContext<TStage extends 'http' | 'ui' | 'pipe'>(
  stage: TStage,
  overrides?: ContextOverrides<TStage>
): MockContext<TStage> {
  const container = createMockContainer();
  const base = { container, state: {} };

  let ctx: unknown;

  if (stage === 'http') {
    const defaults: HttpContext = {
      ...base,
      request: new Request('http://localhost/'),
      response: new Response(),
      params: {},
      url: new URL('http://localhost/'),
    };
    ctx = { ...defaults, ...(overrides ?? {}) };
  } else if (stage === 'ui') {
    const controller = new AbortController();
    const defaults: UiContext = {
      ...base,
      location: {
        pathname: '/',
        search: '',
        hash: '',
        state: null,
        key: 'test-key',
      },
      matches: [],
      params: {},
      signal: controller.signal,
    };
    ctx = { ...defaults, ...(overrides ?? {}) };
  } else {
    const defaults: PipeContext = {
      ...base,
      passable: undefined,
    };
    ctx = { ...defaults, ...(overrides ?? {}) };
  }

  const mockCtx = ctx as MockContext<TStage>;
  mockCtx.runMiddleware = (middleware, next) => runMiddleware(middleware, mockCtx, next);
  return mockCtx;
}
