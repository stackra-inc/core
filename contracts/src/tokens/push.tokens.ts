/**
 * @file push.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the push notification module.
 */

/** DI token for the PushManager instance (multi-provider driver resolver). */
export const PUSH_MANAGER = Symbol.for('PUSH_MANAGER');

/** DI token for the PushService instance (high-level send API with retry + batch). */
export const PUSH_SERVICE = Symbol.for('PUSH_SERVICE');

/** DI token for the resolved push module configuration. */
export const PUSH_CONFIG = Symbol.for('PUSH_CONFIG');
