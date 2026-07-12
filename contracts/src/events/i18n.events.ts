/**
 * @file i18n.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by `@stackra/i18n`.
 *
 *   Emitted by `I18nManager` (translation loading) and
 *   `I18nLocaleService` (locale switching) on the optional
 *   `EVENT_EMITTER` bus.
 *
 *   @example
 *   ```typescript
 *   import { I18N_EVENTS } from '@stackra/contracts';
 *
 *   @OnEvent(I18N_EVENTS.LOCALE_CHANGED)
 *   onLocaleChanged(payload: { locale: string; previous: string }) {
 *     analytics.identify({ locale: payload.locale });
 *   }
 *   ```
 */

/**
 * i18n lifecycle event names.
 *
 * Payload shapes:
 * - `LOCALE_CHANGED`           — `{ locale, previous, dir }`
 * - `DIRECTION_CHANGED`        — `{ locale, dir, previous }`
 * - `TRANSLATIONS_LOADED`      — `{ locale, namespace? }`
 * - `TRANSLATIONS_REFRESHED`   — `{ locales }`
 * - `TRANSLATIONS_SET`         — `{ locales }`
 * - `MISSING_KEY`              — `{ key, locale }`
 */
export const I18N_EVENTS = {
  /** The active locale changed. */
  LOCALE_CHANGED: 'i18n.locale.changed',
  /** Text direction (LTR/RTL) changed. */
  DIRECTION_CHANGED: 'i18n.direction.changed',
  /** Translations for a locale (or namespace) were loaded. */
  TRANSLATIONS_LOADED: 'i18n.translations.loaded',
  /** All locales were re-loaded via the loader. */
  TRANSLATIONS_REFRESHED: 'i18n.translations.refreshed',
  /** Translations were set directly (static loader / tests). */
  TRANSLATIONS_SET: 'i18n.translations.set',
  /** A translation lookup returned no value and fell through to defaults. */
  MISSING_KEY: 'i18n.missing-key',
} as const;

/** Union type of every emitted i18n event name. */
export type I18nEventName = (typeof I18N_EVENTS)[keyof typeof I18N_EVENTS];
