/**
 * @file feature-flags.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by `@stackra/feature-flags`.
 *
 *   Emitted by `FeatureFlagService` on the optional `EVENT_EMITTER`
 *   bus whenever a flag is registered at boot time or evaluated at
 *   runtime. Useful for rollout telemetry, A/B test analytics, and
 *   debugging.
 *
 *   @example
 *   ```typescript
 *   import { FEATURE_FLAG_EVENTS } from '@stackra/contracts';
 *
 *   @OnEvent(FEATURE_FLAG_EVENTS.FLAG_EVALUATED)
 *   onFlagEvaluated(payload: { flag: string; enabled: boolean; identifier?: string }) {
 *     analytics.track('feature_flag.evaluated', payload);
 *   }
 *   ```
 */

/**
 * Feature-flag lifecycle event names.
 *
 * Payload shapes:
 * - `FLAG_REGISTERED` — `{ flag, definition }` (emitted at boot per static flag)
 * - `FLAG_EVALUATED` — `{ flag, enabled, source, identifier?, nodeId?, ownerId? }`
 * - `FLAG_TOGGLED`   — `{ flag, enabled, previous }` (only when a mutable store flips a flag)
 */
export const FEATURE_FLAG_EVENTS = {
  /** A flag definition was registered with the service at boot time. */
  FLAG_REGISTERED: 'feature-flag.registered',
  /** A flag was evaluated for a given context. */
  FLAG_EVALUATED: 'feature-flag.evaluated',
  /** A flag's resolved value changed (mutable stores only). */
  FLAG_TOGGLED: 'feature-flag.toggled',
} as const;

/** Union type of every emitted feature-flag event name. */
export type FeatureFlagEventName = (typeof FEATURE_FLAG_EVENTS)[keyof typeof FEATURE_FLAG_EVENTS];
