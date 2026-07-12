/**
 * @file index.ts
 * @module @stackra/events/testing
 * @description Mock implementation of IEventEmitter for testing.
 *   Provides an in-memory, assertable implementation that records all operations.
 */

import { createAssertableProxy } from '@stackra/testing';

class MockEventEmitter {
  private emittedEvents: Array<{ event: string; data?: unknown }> = [];

  async emit(event: string, data?: unknown): Promise<void> {
    this.emittedEvents.push({ event, data });
  }

  on(_event: string, _handler: (...args: unknown[]) => void): void {}
  off(_event: string, _handler: (...args: unknown[]) => void): void {}

  getEmittedEvents(): Array<{ event: string; data?: unknown }> {
    return [...this.emittedEvents];
  }

  clearEmittedEvents(): void {
    this.emittedEvents = [];
  }
}

/**
 * Create an assertable mock for IEventEmitter.
 *
 * @returns Assertable mock with call recording and assertion methods
 */
export function createMockEvents() {
  return createAssertableProxy(new MockEventEmitter());
}

export { MockEventEmitter };
