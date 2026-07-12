/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file cli-options.interface.ts
 * @module @stackra/container/src/interfaces
 * @description ICliOptions interface.
 */

/** Options for CLI mode (headless command execution). */
export interface ICliOptions {
  /** NestJS log levels to show during boot. Default: ['error'] */
  logLevels?: string[];
  /** Hook called after app boots but before command dispatch. */
  beforeBoot?: (app: any) => Promise<void>;
}
