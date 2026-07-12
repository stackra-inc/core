/**
 * @file i18n.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the i18n system.
 */

/** DI token for the i18n module configuration. */
export const I18N_CONFIG = Symbol.for('I18N_CONFIG');

/** DI token for the I18nManager service. */
export const I18N_MANAGER = Symbol.for('I18N_MANAGER');

/** DI token for the I18nLocaleService. */
export const I18N_LOCALE_SERVICE = Symbol.for('I18N_LOCALE_SERVICE');

/** DI token for the locale storage adapter. */
export const I18N_LOCALE_STORAGE = Symbol.for('I18N_LOCALE_STORAGE');

/** DI token for the DirectionService. */
export const I18N_DIRECTION_SERVICE = Symbol.for('I18N_DIRECTION_SERVICE');

/** DI token for the direction adapter (platform-specific). */
export const I18N_DIRECTION_ADAPTER = Symbol.for('I18N_DIRECTION_ADAPTER');

/** DI token for the I18n service (NestJS). */
export const I18N_SERVICE = Symbol.for('I18N_SERVICE');

/** DI token for the NestJS i18n per-request configuration. */
export const NEST_I18N_CONFIG = Symbol.for('NEST_I18N_CONFIG');

/** DI token for the NestJS i18n resolver chain. */
export const I18N_RESOLVERS = Symbol.for('I18N_RESOLVERS');
