/**
 * @file theming.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the theming module.
 */

/** DI token for IThemeBindings adapter. */
export const THEME_BINDINGS = Symbol.for('THEME_BINDINGS');

/** DI token for ThemingModule configuration. */
export const THEMING_CONFIG = Symbol.for('THEMING_CONFIG');

/** DI token for the ThemeRegistry. */
export const THEME_REGISTRY = Symbol.for('THEME_REGISTRY');

/** DI token for the ThemeTokenStore. */
export const THEME_TOKEN_STORE = Symbol.for('THEME_TOKEN_STORE');

/** DI token for the ThemeService. */
export const THEME_SERVICE = Symbol.for('THEME_SERVICE');
