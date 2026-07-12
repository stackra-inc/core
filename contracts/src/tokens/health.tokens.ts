/**
 * @file health.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the health check system.
 */

/** DI token for the resolved health module options. */
export const HEALTH_CONFIG = Symbol.for('HEALTH_CONFIG');

/** DI token for the result store implementation. */
export const HEALTH_RESULT_STORE = Symbol.for('HEALTH_RESULT_STORE');

/** DI token for the optional health metrics interface. */
export const HEALTH_METRICS = Symbol.for('HEALTH_METRICS');

/** Metadata key for the @HealthIndicator() decorator. */
export const HEALTH_INDICATOR_METADATA_KEY = 'stackra:health:indicator';

/** Token for the Redis connection used by health checks. */
export const HEALTH_REDIS_CONNECTION = Symbol.for('HEALTH_REDIS_CONNECTION');
