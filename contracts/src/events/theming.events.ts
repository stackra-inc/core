/**
 * @file theming.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by `@stackra/theming`.
 *
 *   Emitted by `ThemeService` on the optional `EVENT_EMITTER` bus
 *   whenever the active theme or color mode changes, or whenever
 *   persisted state is restored at boot.
 *
 *   @example
 *   ```typescript
 *   import { THEMING_EVENTS } from '@stackra/contracts';
 *
 *   @OnEvent(THEMING_EVENTS.MODE_CHANGED)
 *   onModeChanged(payload: { mode: string; resolvedMode: string }) {
 *     telemetry.gauge('theming.mode', payload.resolvedMode);
 *   }
 *   ```
 */

/**
 * Theming lifecycle event names.
 *
 * Payload shapes:
 * - `THEME_ACTIVATED`     — `{ themeId, previous }`
 * - `MODE_CHANGED`        — `{ mode, resolvedMode, previous, source }`
 *   - `source` is `'user'` (setMode call) or `'system'` (OS preference change)
 * - `TOKENS_CHANGED`      — `{ themeId, mode }`
 * - `STATE_RESTORED`      — `{ themeId, mode, resolvedMode }`
 * - `THEME_REGISTERED`    — `{ themeId, source }` (built-in or config)
 */
export const THEMING_EVENTS = {
  /** A named theme preset was activated. */
  THEME_ACTIVATED: 'theming.theme.activated',
  /** The color mode preference changed. */
  MODE_CHANGED: 'theming.mode.changed',
  /** The active token set was applied or re-applied. */
  TOKENS_CHANGED: 'theming.tokens.changed',
  /** Persisted theme state was restored at boot. */
  STATE_RESTORED: 'theming.state.restored',
  /** A theme was registered with the registry. */
  THEME_REGISTERED: 'theming.theme.registered',
} as const;

/** Union type of every emitted theming event name. */
export type ThemingEventName = (typeof THEMING_EVENTS)[keyof typeof THEMING_EVENTS];
