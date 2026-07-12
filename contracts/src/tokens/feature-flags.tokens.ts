/**
 * @file feature-flags.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the feature flags package.
 */

/** DI token for the feature flags module options. */
export const FEATURE_FLAGS_CONFIG = Symbol.for('FEATURE_FLAGS_CONFIG');

/** DI token for the feature flag service instance. */
export const FEATURE_FLAG_SERVICE = Symbol.for('FEATURE_FLAG_SERVICE');

/** DI token for an optional permission resolver. */
export const PERMISSION_RESOLVER = Symbol.for('PERMISSION_RESOLVER');
