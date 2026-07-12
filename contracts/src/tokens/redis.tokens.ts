/**
 * @file redis.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the Redis system.
 */

/** Token for the default Redis client instance. */
export const REDIS_CLIENT = Symbol.for('REDIS_CLIENT');

/** Token for the Redis manager (multi-connection). */
export const REDIS_MANAGER = Symbol.for('REDIS_MANAGER');

/** Token for the Redis module configuration. */
export const REDIS_CONFIG = Symbol.for('REDIS_CONFIG');

/** Token for the Redis lock service. */
export const REDIS_LOCK_SERVICE = Symbol.for('REDIS_LOCK_SERVICE');

/** Token for the Redis transport configuration. */
export const REDIS_TRANSPORT_CONFIG = Symbol.for('REDIS_TRANSPORT_CONFIG');

/** Token for the tenant config repository. */
export const TENANT_CONFIG_REPOSITORY = Symbol.for('TENANT_CONFIG_REPOSITORY');

/** Metadata key for the @StreamProcessor() decorator. */
export const STREAM_PROCESSOR_METADATA_KEY = 'stackra:redis:stream_processor';

/** Registration token for NestJS all-backends provider. */
export const NEST_REDIS_BACKENDS_REGISTRATION = Symbol.for('NEST_REDIS_ALL_BACKENDS_REG');
