/**
 * @file pubsub.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the PubSub package.
 */

/** Token under which the active `PubSubService` is registered. */
export const PUBSUB_SERVICE = Symbol.for('PUBSUB_SERVICE');
