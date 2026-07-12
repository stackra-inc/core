/**
 * @file notification-template.interface.ts
 * @module @stackra/contracts/interfaces/notification
 * @description Contracts for the notification template system.
 *   Templates define per-channel content with placeholders. Placeholder
 *   resolvers are bound by domain packages and lazily resolve data at render time.
 */

// ============================================================================
// Template Channel Content
// ============================================================================

/** Email template content. */
export interface ITemplateEmailContent {
  /** Subject line (supports placeholders). */
  readonly subject: string;
  /** HTML body (supports placeholders). */
  readonly html: string;
  /** Plain text fallback (supports placeholders). */
  readonly text?: string;
}

/** SMS template content. */
export interface ITemplateSmsContent {
  /** SMS body text (supports placeholders). Max 1600 chars after render. */
  readonly body: string;
}

/** Push notification template content. */
export interface ITemplatePushContent {
  /** Push title (supports placeholders). */
  readonly title: string;
  /** Push body (supports placeholders). */
  readonly body: string;
  /** Image URL (supports placeholders). */
  readonly imageUrl?: string;
}

/** Slack template content. */
export interface ITemplateSlackContent {
  /** Plain text message (supports placeholders). */
  readonly text: string;
  /** Block Kit blocks (JSON, supports placeholder interpolation in string fields). */
  readonly blocks?: unknown[];
}

/** In-app notification template content. */
export interface ITemplateInAppContent {
  /** Subject/title for notification center. */
  readonly subject?: string;
  /** Body text for notification center. */
  readonly body: string;
}

// ============================================================================
// Notification Template
// ============================================================================

/**
 * A notification template definition.
 *
 * Templates are registered at boot by packages (static) or loaded from
 * the database (admin-managed). Each template defines per-channel content
 * with `{{namespace.key}}` placeholders that are resolved at render time.
 *
 * @example
 * ```typescript
 * const template: INotificationTemplate = {
 *   name: 'order.confirmed',
 *   description: 'Sent when an order is confirmed',
 *   category: 'orders',
 *   channels: {
 *     email: { subject: 'Order #{{order.number}} Confirmed', html: '<h1>Thank you {{user.name}}!</h1>' },
 *     sms: { body: 'Order #{{order.number}} confirmed.' },
 *     push: { title: 'Order Confirmed', body: '#{{order.number}} is on its way!' },
 *   },
 * };
 * ```
 */
export interface INotificationTemplate {
  /** Unique template identifier (dot-separated: 'order.confirmed', 'auth.otp'). */
  readonly name: string;
  /** Human-readable description for admin UI. */
  readonly description?: string;
  /** Category for grouping in admin (e.g., 'orders', 'auth', 'marketing'). */
  readonly category?: string;
  /** Per-channel template content. Only channels listed here are renderable. */
  readonly channels: {
    readonly email?: ITemplateEmailContent;
    readonly sms?: ITemplateSmsContent;
    readonly push?: ITemplatePushContent;
    readonly slack?: ITemplateSlackContent;
    readonly 'in-app'?: ITemplateInAppContent;
  };
  /** Metadata tags for filtering/search. */
  readonly tags?: string[];
}

// ============================================================================
// Placeholder Resolver
// ============================================================================

/**
 * Contract for domain-specific placeholder resolvers.
 *
 * Each domain package (customer, order, venue, etc.) registers a resolver
 * for its namespace. The TemplateRenderer discovers all resolvers via the
 * `PlaceholderRegistry` and calls `resolve(key, context)` for each
 * `{{namespace.key}}` placeholder found in template content.
 *
 * @example
 * ```typescript
 * @PlaceholderProvider('order')
 * export class OrderPlaceholderResolver implements IPlaceholderResolver {
 *   readonly namespace = 'order';
 *
 *   async resolve(key: string, context: Record<string, unknown>): Promise<string | undefined> {
 *     const order = await this.orderService.findById(context.orderId as string);
 *     switch (key) {
 *       case 'number': return order?.number;
 *       case 'total': return order?.total?.toString();
 *       default: return undefined;
 *     }
 *   }
 * }
 * ```
 */
export interface IPlaceholderResolver {
  /** Namespace this resolver handles (e.g., 'order', 'user', 'venue'). */
  readonly namespace: string;

  /**
   * Resolve a single placeholder key within this namespace.
   *
   * @param key - The placeholder key (e.g., 'name', 'number', 'email')
   * @param context - Render context containing IDs and metadata for lookup
   * @returns Resolved string value, or undefined if the key is unknown
   */
  resolve(key: string, context: Record<string, unknown>): Promise<string | undefined>;
}

// ============================================================================
// Rendered Output
// ============================================================================

/**
 * Result of rendering a template — per-channel resolved content.
 */
export interface IRenderedTemplate {
  /** Template name that was rendered. */
  readonly templateName: string;
  /** Rendered email content (undefined if channel not in template). */
  readonly email?: { subject: string; html: string; text?: string };
  /** Rendered SMS content. */
  readonly sms?: { body: string };
  /** Rendered push content. */
  readonly push?: { title: string; body: string; imageUrl?: string };
  /** Rendered Slack content. */
  readonly slack?: { text: string; blocks?: unknown[] };
  /** Rendered in-app content. */
  readonly 'in-app'?: { subject?: string; body: string };
}
