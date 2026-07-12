/**
 * @file worker-options.interface.ts
 * @module @stackra/container/src/interfaces
 * @description IWorkerOptions interface.
 */

/** Options for Worker mode (long-running queue consumer). */
export interface IWorkerOptions {
  /** Queue names to consume. Default: all registered. */
  queues?: string[];
  /** Worker concurrency override per queue. */
  concurrency?: number;
  /** NestJS log levels to show. Default: ['error', 'warn', 'log'] */
  logLevels?: string[];
  /** Graceful shutdown timeout in ms. Default: 10000 */
  shutdownTimeout?: number;
}
