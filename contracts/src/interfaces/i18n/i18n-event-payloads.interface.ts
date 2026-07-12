/**
 * @file i18n-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/i18n
 * @description Typed payloads for every constant in `I18N_EVENTS`.
 */

/**
 * Text direction. Mirrors the runtime value used by
 * `I18nDirectionService`.
 */
export type I18nDirection = 'ltr' | 'rtl';

/**
 * Payload for `I18N_EVENTS.LOCALE_CHANGED` — the active locale
 * transitioned from `previous` to `locale`.
 */
export interface II18nLocaleChangedPayload {
  /** New locale code (BCP-47, e.g. `en-US`, `ar-SA`). */
  readonly locale: string;
  /** Locale code before the change. */
  readonly previous: string;
  /** Text direction associated with the new locale. */
  readonly dir: I18nDirection;
}

/**
 * Payload for `I18N_EVENTS.DIRECTION_CHANGED` — text direction
 * flipped independently of the locale (rare — usually happens as a
 * side effect of locale change).
 */
export interface II18nDirectionChangedPayload {
  /** Current locale (unchanged). */
  readonly locale: string;
  /** New direction. */
  readonly dir: I18nDirection;
  /** Direction before the change. */
  readonly previous: I18nDirection;
}

/**
 * Payload for `I18N_EVENTS.TRANSLATIONS_LOADED` — translations for
 * one locale (optionally scoped to a namespace) were loaded.
 */
export interface II18nTranslationsLoadedPayload {
  /** Locale that was loaded. */
  readonly locale: string;
  /** Namespace loaded, or `undefined` for the full locale. */
  readonly namespace?: string;
}

/**
 * Payload for `I18N_EVENTS.TRANSLATIONS_REFRESHED` — every locale
 * was re-loaded via the configured loader (typically after remote
 * updates).
 */
export interface II18nTranslationsRefreshedPayload {
  /** Locales that were refreshed. */
  readonly locales: readonly string[];
}

/**
 * Payload for `I18N_EVENTS.TRANSLATIONS_SET` — translations were
 * set directly (static loader or tests).
 */
export interface II18nTranslationsSetPayload {
  /** Locales included in the set operation. */
  readonly locales: readonly string[];
}

/**
 * Payload for `I18N_EVENTS.MISSING_KEY` — a translation lookup
 * fell through and used the default value instead.
 */
export interface II18nMissingKeyPayload {
  /** Translation key that was missing. */
  readonly key: string;
  /** Locale the key was looked up under. */
  readonly locale: string;
}
