/**
 * @file theming-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/theming
 * @description Typed payloads for every constant in `THEMING_EVENTS`.
 */

/**
 * Color mode preference. Mirrors the runtime values used by
 * `ThemeService`.
 */
export type ThemingColorMode = 'light' | 'dark' | 'system';

/**
 * Effective (resolved) color mode after `system` has been resolved
 * against the OS preference.
 */
export type ThemingResolvedMode = 'light' | 'dark';

/**
 * Payload for `THEMING_EVENTS.THEME_ACTIVATED` — a preset was
 * activated by `ThemeService.setTheme()`.
 */
export interface IThemingThemeActivatedPayload {
  /** New theme id. */
  readonly themeId: string;
  /** Theme id that was active before the change. */
  readonly previous: string;
}

/**
 * Payload for `THEMING_EVENTS.MODE_CHANGED` — the color-mode
 * preference changed (user action or system update).
 */
export interface IThemingModeChangedPayload {
  /** New user-facing mode preference. */
  readonly mode: ThemingColorMode;
  /** Effective mode after `system` is resolved. */
  readonly resolvedMode: ThemingResolvedMode;
  /** Preference before the change. */
  readonly previous: ThemingColorMode;
  /** What triggered the change. */
  readonly source: 'user' | 'system';
}

/**
 * Payload for `THEMING_EVENTS.TOKENS_CHANGED` — the active token
 * set was applied or re-applied to the DOM / native store.
 */
export interface IThemingTokensChangedPayload {
  /** Active theme id when the tokens were applied. */
  readonly themeId: string;
  /** Effective color mode. */
  readonly mode: ThemingResolvedMode;
}

/**
 * Payload for `THEMING_EVENTS.STATE_RESTORED` — persisted state
 * (theme id + mode) was restored at boot from the preferences
 * store.
 */
export interface IThemingStateRestoredPayload {
  /** Theme id restored from persistence. */
  readonly themeId: string;
  /** Mode preference restored from persistence. */
  readonly mode: ThemingColorMode;
  /** Effective mode after resolving `system`. */
  readonly resolvedMode: ThemingResolvedMode;
}

/**
 * Payload for `THEMING_EVENTS.THEME_REGISTERED` — a theme was
 * added to `ThemeRegistry`.
 */
export interface IThemingThemeRegisteredPayload {
  /** Registered theme id. */
  readonly themeId: string;
  /**
   * The registered theme's config object. Loose-typed (`unknown`)
   * because the concrete shape lives in `@stackra/theming` and we
   * don't want contracts to import from a downstream package.
   */
  readonly source: unknown;
}
