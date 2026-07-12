/**
 * @file push-provider.interface.ts
 * @module @stackra/contracts/interfaces/push
 * @description Contracts for push notification providers and their payloads.
 */

// ============================================================================
// Push Payload
// ============================================================================

/**
 * Push notification message payload.
 */
export interface IPushPayload {
  /** Device token (FCM registration token, APNS device token, Expo push token). */
  readonly token: string;
  /** Notification title. */
  readonly title: string;
  /** Notification body text. */
  readonly body: string;
  /** Custom data payload (key-value pairs, delivered to app). */
  readonly data?: Record<string, string>;
  /** Badge count to display on app icon (iOS). */
  readonly badge?: number;
  /** Sound to play (filename or 'default'). */
  readonly sound?: string;
  /** Image URL for rich notifications. */
  readonly imageUrl?: string;
  /** Android notification channel ID. */
  readonly channelId?: string;
  /** Delivery priority. */
  readonly priority?: 'normal' | 'high';
  /** Time-to-live in seconds (how long the message is stored if device is offline). */
  readonly ttl?: number;
  /** Topic for topic-based messaging (FCM). */
  readonly topic?: string;
  /** Collapse key to replace previous notifications (FCM/APNS). */
  readonly collapseKey?: string;
}

// ============================================================================
// Push Result
// ============================================================================

/**
 * Result returned by a provider after a single push send attempt.
 */
export interface IPushResult {
  /** Whether the push was accepted by the provider. */
  readonly success: boolean;
  /** Provider-assigned message ID for tracking. */
  readonly messageId?: string;
  /** Error message if delivery failed. */
  readonly error?: string;
  /** Whether the device token is expired/invalid and should be removed. */
  readonly tokenExpired?: boolean;
  /** Whether the failure is permanent (no retry). */
  readonly permanent?: boolean;
}

/**
 * Result for batch push operations.
 */
export interface IPushBatchResult {
  /** Total number of messages in the batch. */
  readonly total: number;
  /** Number of successful deliveries. */
  readonly successCount: number;
  /** Number of failed deliveries. */
  readonly failureCount: number;
  /** Individual results per token. */
  readonly results: IPushResult[];
  /** Tokens that were detected as expired. */
  readonly expiredTokens: string[];
}

// ============================================================================
// Provider Config
// ============================================================================

/**
 * Provider-specific configuration passed at runtime.
 * Each provider defines its own shape.
 */
export interface IPushProviderConfig {
  [key: string]: unknown;
}

// ============================================================================
// Provider Interface
// ============================================================================

/**
 * Contract that all push notification providers must implement.
 *
 * Providers handle the actual communication with the push service
 * (FCM, APNS, Expo, Web Push). They receive payloads and return results.
 */
export interface IPushProvider {
  /** Provider identifier (e.g., 'fcm', 'apns', 'expo', 'web-push'). */
  readonly name: string;

  /**
   * Send a single push notification.
   *
   * @param payload - Push message payload with device token
   * @param config - Provider-specific configuration
   * @returns Send result with success status
   */
  send(payload: IPushPayload, config: IPushProviderConfig): Promise<IPushResult>;

  /**
   * Send a batch of push notifications.
   *
   * Providers that support native batching (FCM sendEachForMulticast) use it.
   * Others fall back to parallel individual sends.
   *
   * @param payloads - Array of push payloads
   * @param config - Provider-specific configuration
   * @returns Batch result with per-token breakdown
   */
  sendBatch(payloads: IPushPayload[], config: IPushProviderConfig): Promise<IPushBatchResult>;

  /**
   * Verify that the provider configuration is valid.
   *
   * @param config - Provider-specific configuration to validate
   * @returns True if the configuration is valid
   */
  validate(config: IPushProviderConfig): boolean;
}

// ============================================================================
// Module Config
// ============================================================================

/**
 * Push module configuration.
 *
 * Passed to `PushModule.forRoot()` to configure providers and defaults.
 */
export interface IPushConfig {
  /** Default provider name (must match a key in `providers`). */
  readonly default: string;
  /** Map of provider name → provider-specific configuration. */
  readonly providers: Record<string, IPushProviderConfig>;
  /** Retry configuration for transient failures. */
  readonly retry?: {
    /** Maximum number of send attempts. Default: 3. */
    readonly attempts: number;
    /** Base backoff delay in milliseconds (exponential). Default: 1000. */
    readonly backoff: number;
  };
  /** Maximum batch size per provider call. Default: 500. */
  readonly batchSize?: number;
  /** Whether to auto-remove expired tokens. Default: true. */
  readonly autoRemoveExpired?: boolean;
  /** Whether to log payloads at debug level. Default: false. */
  readonly debug?: boolean;
}

/**
 * Async configuration options for `PushModule.forRootAsync()`.
 */
export interface IPushModuleAsyncOptions {
  /** Modules to import for dependency injection. */
  readonly imports?: any[];
  /** Factory function returning IPushConfig. */
  readonly useFactory: (...args: any[]) => IPushConfig | Promise<IPushConfig>;
  /** Dependencies to inject into the factory function. */
  readonly inject?: any[];
}
