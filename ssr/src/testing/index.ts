/**
 * @file index.ts
 * @module @stackra/ssr/testing
 * @description Public API for the `@stackra/ssr/testing` subpath.
 *
 *   Test helpers for middleware — mock containers, mock stage contexts,
 *   and a standalone middleware runner. All mocks use the assertable
 *   primitives from `@stackra/testing` so calls are recorded and
 *   assertable via `mock.$`.
 */

export { createMockContainer, MockContainerImpl } from './mock-container';
export type { MockContainer, IMockContainer } from './mock-container';

export { createMockContext } from './create-mock-context';
export type { MockContext, ContextOverrides } from './create-mock-context';

export { runMiddleware } from './run-middleware';
