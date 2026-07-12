/**
 * @file realtime.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the realtime package.
 */

/** Token for the RealtimeManager service. */
export const REALTIME_MANAGER = Symbol.for('REALTIME_MANAGER');

/** Token for the realtime module configuration. */
export const REALTIME_CONFIG = Symbol.for('REALTIME_CONFIG');
