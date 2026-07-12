/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/i18n
 * @description Barrel for i18n contract types (event payloads).
 *
 *   The i18n manager/service/config types live inside the
 *   `@stackra/i18n` package because they're only consumed there.
 *   Only the event payloads are exposed here since cross-package
 *   listeners subscribe to `I18N_EVENTS`.
 */
export type {
  I18nDirection,
  II18nLocaleChangedPayload,
  II18nDirectionChangedPayload,
  II18nTranslationsLoadedPayload,
  II18nTranslationsRefreshedPayload,
  II18nTranslationsSetPayload,
  II18nMissingKeyPayload,
} from './i18n-event-payloads.interface';
