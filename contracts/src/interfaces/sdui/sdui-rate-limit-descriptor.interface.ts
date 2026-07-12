/**
 * @file sdui-rate-limit-descriptor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Descriptor for the rate-limit policy attached to an
 *   action. The action executor delegates to
 *   `@stackra/rate-limit` — SDUI does NOT enforce limits itself.
 */

/**
 * Reference to a named rate-limit policy registered with
 * `@stackra/rate-limit`. The executor invokes
 * `RateLimiterManager.reserve(policy)` before calling the handler.
 */
export interface ISduiNamedRateLimitDescriptor {
  /** Policy name registered with `@stackra/rate-limit`. */
  readonly policy: string;
}

/**
 * Inline rate-limit configuration. Useful for one-off limits that
 * don't deserve a named policy.
 */
export interface ISduiInlineRateLimitDescriptor {
  /**
   * Key template — supports placeholders `{userId}`, `{ownerId}`,
   * `{ip}`, `{method}`, `{path}`. Resolved by the executor using
   * the action context before invoking the limiter.
   */
  readonly key: string;

  /** Maximum requests permitted inside the rolling window. */
  readonly limit: number;

  /** Window length in seconds. */
  readonly window: number;
}

/**
 * Either a named policy reference or an inline policy definition.
 */
export type SduiRateLimitDescriptor =
  ISduiNamedRateLimitDescriptor | ISduiInlineRateLimitDescriptor;
