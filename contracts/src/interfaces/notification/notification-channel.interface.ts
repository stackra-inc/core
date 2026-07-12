/**
 * @file notification-channel.interface.ts
 * @module @stackra/contracts/interfaces/notification
 * @description Contract for notification delivery channels.
 *   Each channel (email, SMS, push, etc.) implements this interface
 *   to provide a unified dispatch surface for the NotificationService.
 */

// ============================================================================
// Recipient
// ============================================================================

/**
 * Notification recipient — the target of a channel delivery.
 *
 * Contains all contact identifiers and preference flags needed by channels
 * to determine if and how they can reach this recipient.
 */
export interface INotificationRecipient {
  /** Unique recipient identifier (user ID, contact ID, etc.). */
  readonly id: string;
  /** Email address (required for email channel). */
  readonly email?: string;
  /** Phone number in E.164 format (required for SMS channel). */
  readonly phone?: string;
  /** Push notification device tokens (required for push channel). */
  readonly deviceTokens?: string[];
  /** Per-channel opt-in/opt-out preferences (channel name → enabled). */
  readonly preferences?: Record<string, boolean>;
  /** Arbitrary recipient metadata for channel-specific use. */
  readonly metadata?: Record<string, unknown>;
}

// ============================================================================
// Payload
// ============================================================================

/**
 * Notification payload — the content delivered through a channel.
 *
 * Channel implementations map these fields to their native format
 * (e.g., email subject/body, push title/message, Slack blocks).
 */
export interface INotificationPayload {
  /** Subject line (email, push title). */
  readonly subject?: string;
  /** Plain text body content. */
  readonly body: string;
  /** HTML body content (email, rich notifications). */
  readonly html?: string;
  /** Arbitrary data passed to the channel for custom rendering. */
  readonly data?: Record<string, unknown>;
  /** Call-to-action link with URL and display label. */
  readonly action?: { readonly url: string; readonly label: string };
  /** Image URL for rich notifications. */
  readonly imageUrl?: string;
}

// ============================================================================
// Channel Result
// ============================================================================

/**
 * Result returned by a channel's `send()` method.
 *
 * Indicates whether delivery succeeded and provides
 * provider-specific metadata for tracking.
 */
export interface IChannelResult {
  /** Whether the notification was delivered successfully. */
  readonly success: boolean;
  /** Provider-assigned message ID (for tracking/correlation). */
  readonly messageId?: string;
  /** Error message when delivery fails. */
  readonly error?: string;
  /** Whether the failure is permanent (no retry). */
  readonly permanent?: boolean;
}

// ============================================================================
// Channel Interface
// ============================================================================

/**
 * Contract for notification delivery channels.
 *
 * Each channel (email, SMS, push, in-app, webhook, Slack) implements this
 * interface. Channels are registered with the ChannelRegistryService and
 * resolved by name at dispatch time.
 *
 * Channels self-register via the `@Channel('name')` decorator from
 * `@stackra/contracts`.
 */
export interface INotificationChannel {
  /** Unique channel name (e.g., 'email', 'sms', 'push', 'in-app'). */
  readonly name: string;

  /**
   * Send a notification through this channel.
   *
   * @param recipient - The target recipient
   * @param payload - The notification content
   * @param options - Channel-specific delivery options
   * @returns Delivery result with success status and optional message ID
   */
  send(
    recipient: INotificationRecipient,
    payload: INotificationPayload,
    options?: Record<string, unknown>,
  ): Promise<IChannelResult>;

  /**
   * Check if this channel supports the given recipient.
   *
   * Returns false if the recipient lacks required contact info
   * (e.g., no email for the email channel, no phone for SMS).
   *
   * @param recipient - The recipient to check
   * @returns Whether this channel can reach the recipient
   */
  supports(recipient: INotificationRecipient): boolean;
}
