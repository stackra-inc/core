/**
 * @file index.ts
 * @module @stackra/scheduler/testing
 * @description Mock implementation of ISchedulerService for testing.
 *   Provides an in-memory, assertable implementation that records all operations.
 */

import { createAssertableProxy } from '@stackra/testing';

class MockScheduler {
  private tasks: Array<{ name: string; cron?: string; interval?: number }> = [];

  register(name: string, cron?: string, interval?: number): void {
    this.tasks.push({ name, cron, interval });
  }

  getScheduledTasks() {
    return [...this.tasks];
  }
  clearScheduledTasks(): void {
    this.tasks = [];
  }
}

/**
 * Create an assertable mock for ISchedulerService.
 *
 * @returns Assertable mock with call recording and assertion methods
 */
export function createMockScheduler() {
  return createAssertableProxy(new MockScheduler());
}

export { MockScheduler };
