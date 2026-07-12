/**
 * @file logger.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the logger system.
 */

/** Token for the LoggerManager instance. */
export const LOGGER_MANAGER = Symbol.for('LOGGER_MANAGER');

/** Token for the logger module configuration. */
export const LOGGER_CONFIG = Symbol.for('LOGGER_CONFIG');
