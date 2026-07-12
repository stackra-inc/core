/**
 * @file processor-options.interface.ts
 * @module @stackra/queue/src/interfaces
 * @description IProcessorOptions interface.
 */

/** Options for the @Processor decorator. */
export interface IProcessorOptions {
  /** Queue name this processor handles. */
  queue: string;
  /** Connection name (optional — defaults to module default). */
  connection?: string;
}
