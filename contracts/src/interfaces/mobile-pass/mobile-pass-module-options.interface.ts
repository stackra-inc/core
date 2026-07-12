/**
 * @file mobile-pass-module-options.interface.ts
 * @module @stackra/contracts/interfaces/mobile-pass
 * @description Configuration contract for `MobilePassModule.forRoot()`.
 *
 *   Cross-package: lives in contracts because the module consumes it,
 *   the config token `MOBILE_PASS_CONFIG` resolves to it, and services
 *   (`PkPassGenerator`, `ApplePushService`, `GoogleWalletClient`,
 *   guards) inject it.
 */

/**
 * Apple PassKit web service configuration.
 *
 * The `secret` is the authentication token Apple echoes back in the
 * `Authorization: ApplePass <secret>` header; `host` is the public
 * base URL the device calls back to.
 */
export interface IAppleWebserviceConfig {
  /** Shared secret used to authenticate PassKit web-service calls. */
  readonly secret: string;
  /** Public base URL of the web service (e.g. `https://api.example.com`). */
  readonly host: string;
}

/**
 * Apple Wallet platform configuration. Presence of this block enables
 * the Apple providers (PkPassGenerator, ApplePushService, webservice
 * controller, auth guard).
 */
export interface IApplePassConfig {
  /** Organization name printed on every pass. */
  readonly organizationName?: string;
  /** Pass type identifier (e.g. `pass.com.example.mypass`). Required. */
  readonly typeIdentifier: string;
  /** Apple developer team identifier. Required. */
  readonly teamIdentifier: string;
  /**
   * P12 signing certificate. Accepts a base64 string or raw bytes
   * (`Buffer` / `Uint8Array`). Required.
   */
  readonly certificate: string | Uint8Array;
  /** Password for the P12 certificate. Required. */
  readonly certificatePassword: string;
  /** PassKit web service settings (secret + host). */
  readonly webservice: IAppleWebserviceConfig;
  /**
   * Override for the APNs base URL. Defaults to
   * `https://api.push.apple.com`. Set to the sandbox host for testing.
   */
  readonly pushBaseUrl?: string;
}

/**
 * Google Wallet platform configuration. Presence of this block enables
 * the Google providers (GoogleWalletClient, callback controller).
 */
export interface IGooglePassConfig {
  /** Google Wallet issuer identifier. Required. */
  readonly issuerId: string;
  /**
   * Service account credentials — either the parsed JSON object or a
   * JSON string. Must contain `client_email` and `private_key`.
   * Required.
   */
  readonly serviceAccountKey: string | Record<string, string>;
  /** Allowed origins embedded in the signed "save to wallet" JWT. */
  readonly origins?: readonly string[];
}

/**
 * Queue configuration for asynchronous push updates. Set `connection`
 * to `null` to disable the push processor entirely.
 */
export interface IMobilePassQueueConfig {
  /**
   * Named queue connection to dispatch push jobs on. `null` disables
   * the async push processor; `undefined` uses the module default.
   */
  readonly connection?: string | null;
}

/**
 * Custom builder registration map. Keys are builder names; values are
 * builder class constructors resolved by the `BuilderRegistry`.
 */
export interface IMobilePassBuildersConfig {
  /** Custom Apple Wallet builders, keyed by builder name. */
  readonly apple?: Readonly<Record<string, unknown>>;
  /** Custom Google Wallet builders, keyed by builder name. */
  readonly google?: Readonly<Record<string, unknown>>;
}

/**
 * Root configuration passed to `MobilePassModule.forRoot()`.
 *
 * At least one of `apple` / `google` should be provided; the module
 * registers each platform's providers conditionally.
 */
export interface IMobilePassModuleOptions {
  /** Apple Wallet configuration. Enables Apple providers when present. */
  readonly apple?: IApplePassConfig;
  /** Google Wallet configuration. Enables Google providers when present. */
  readonly google?: IGooglePassConfig;
  /** Queue configuration for async push updates. */
  readonly queue?: IMobilePassQueueConfig;
  /** Custom builder registrations. */
  readonly builders?: IMobilePassBuildersConfig;
  /**
   * Path prefix for the mounted web-service routes. Defaults to
   * `passkit/v1`.
   */
  readonly routePrefix?: string;
}
