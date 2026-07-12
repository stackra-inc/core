/**
 * @file events.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the event system.
 */

/** Token for the EventEmitter instance. */
export const EVENT_EMITTER = Symbol.for('EVENT_EMITTER');

/** Token for the event emitter module configuration. */
export const EVENT_EMITTER_CONFIG = Symbol.for('EVENT_EMITTER_CONFIG');
