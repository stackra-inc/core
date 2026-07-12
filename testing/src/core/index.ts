/**
 * @file index.ts
 * @module @stackra/testing/core
 * @description Public API for @stackra/testing.
 *   Assertable primitives + Vitest preset/setup.
 */

// ============================================================================
// Assertable primitives
// ============================================================================
export { Assertable } from './assertable';
export {
  createAssertableProxy,
  ASSERTABLE_SYMBOL,
  type AssertableProxy,
} from './assertable-proxy';
export type { ICallRecord, IStubEntry } from './interfaces';
