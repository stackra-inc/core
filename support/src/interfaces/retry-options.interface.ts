/**
 * @file retry-options.interface.ts
 * @module @stackra/support/interfaces
 * @description Configuration options for the retry utility.
 */

/** Configuration for the retry utility. */
export interface IRetryOptions {
  /** Maximum number of attempts (default: 3). */
  times?: number;
  /** Base delay between attempts in ms (default: 100). */
  delay?: number;
  /** Backoff strategy (default: 'linear'). */
  backoff?: 'linear' | 'exponential';
  /** Only retry if predicate returns true for the error. */
  when?: (error: Error) => boolean;
}
