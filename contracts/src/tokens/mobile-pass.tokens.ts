/**
 * @file mobile-pass.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the mobile wallet pass module
 *   (`@stackra/mobile-pass`).
 *
 *   Cross-package: the tokens live in contracts because the module
 *   binds them, consumers inject them, and the value types they
 *   resolve to are declared alongside in
 *   `interfaces/mobile-pass/`.
 */

/** DI token for the resolved mobile-pass module configuration. */
export const MOBILE_PASS_CONFIG = Symbol.for('MOBILE_PASS_CONFIG');

/** DI token for the high-level `MobilePassService` facade. */
export const MOBILE_PASS_SERVICE = Symbol.for('MOBILE_PASS_SERVICE');

/** DI token for the `BuilderRegistry`. */
export const MOBILE_PASS_BUILDER_REGISTRY = Symbol.for('MOBILE_PASS_BUILDER_REGISTRY');

/** DI token carrying the custom builders map from `forRoot()`. */
export const MOBILE_PASS_CUSTOM_BUILDERS = Symbol.for('MOBILE_PASS_CUSTOM_BUILDERS');

/** DI token for the `PkPassGenerator` (Apple `.pkpass` signer). */
export const MOBILE_PASS_PKPASS_GENERATOR = Symbol.for('MOBILE_PASS_PKPASS_GENERATOR');

/** DI token for the `ApplePushService` (APNs HTTP/2 client). */
export const MOBILE_PASS_APPLE_PUSH = Symbol.for('MOBILE_PASS_APPLE_PUSH');

/** DI token for the `GoogleWalletClient` (Google Wallet REST API + JWT). */
export const MOBILE_PASS_GOOGLE_CLIENT = Symbol.for('MOBILE_PASS_GOOGLE_CLIENT');
