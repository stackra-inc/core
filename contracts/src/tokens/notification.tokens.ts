/**
 * @file notification.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the notification orchestration module.
 */

/** DI token for the NotificationService instance. */
export const NOTIFICATION_SERVICE = Symbol.for('NOTIFICATION_SERVICE');

/** DI token for the resolved notification module configuration. */
export const NOTIFICATION_CONFIG = Symbol.for('NOTIFICATION_CONFIG');

/** DI token for the ChannelRegistryService. */
export const CHANNEL_REGISTRY = Symbol.for('CHANNEL_REGISTRY');
