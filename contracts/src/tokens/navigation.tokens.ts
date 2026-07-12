/**
 * @file navigation.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the navigation package.
 */

/** DI token for the navigation module config. */
export const NAVIGATION_CONFIG = Symbol.for('NAVIGATION_CONFIG');

/** DI token for the navigation service. */
export const NAVIGATION_SERVICE = Symbol.for('NAVIGATION_SERVICE');

/** DI token for the navigation cache. */
export const NAVIGATION_CACHE = Symbol.for('NAVIGATION_CACHE');

/** DI token for the navigation analytics service. */
export const NAV_ANALYTICS = Symbol.for('NAV_ANALYTICS');

/** DI token for the menu transformer pipeline. */
export const MENU_TRANSFORMER_PIPELINE = Symbol.for('MENU_TRANSFORMER_PIPELINE');

/** DI token for the menu transformer registry. */
export const MENU_TRANSFORMER_REGISTRY = Symbol.for('MENU_TRANSFORMER_REGISTRY');

/** DI token for the icon resolver registry. */
export const ICON_RESOLVER_REGISTRY = Symbol.for('ICON_RESOLVER_REGISTRY');

/** DI token for the menu block registry. */
export const MENU_BLOCK_REGISTRY = Symbol.for('MENU_BLOCK_REGISTRY');

/** DI token for the behavior registry. */
export const BEHAVIOR_REGISTRY = Symbol.for('BEHAVIOR_REGISTRY');

/** DI token for the predicate registry. */
export const PREDICATE_REGISTRY = Symbol.for('PREDICATE_REGISTRY');

/** DI token for the shortcut registry. */
export const SHORTCUT_REGISTRY = Symbol.for('SHORTCUT_REGISTRY');

/** DI token for keyboard hints store. */
export const KEYBOARD_HINTS_STORE = Symbol.for('KEYBOARD_HINTS_STORE');
