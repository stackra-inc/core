/**
 * @file sdui-notification-channel.enum.ts
 * @module @stackra/contracts/enums/sdui
 * @description Notification dispatch channels. SDUI never implements
 *   channel transport itself — it forwards the descriptor to
 *   `@stackra/nestjs-notifications`, which owns email / SMS / push
 *   delivery. SDUI only handles the `'toast'` channel inline.
 */

/**
 * Notification channels SDUI may target.
 *
 * - `'in-app'`     — persist a notification record for the bell-icon panel.
 * - `'toast'`      — show a transient HeroUI Toast on the current client.
 *                    Handled by SDUI directly (the only inline channel).
 * - `'email'`      — delegate to `@stackra/notifications` mail transport.
 * - `'sms'`        — delegate to `@stackra/notifications` SMS transport.
 * - `'push'`       — delegate to `@stackra/notifications` push transport.
 * - `'broadcast'`  — emit a realtime event so other tabs/devices pick it up.
 * - `'webhook'`    — delegate to `@stackra/notifications` webhook destination.
 */
export type SduiNotificationChannel =
  'in-app' | 'toast' | 'email' | 'sms' | 'push' | 'broadcast' | 'webhook';

/** Tuple of every supported channel for Zod enum validation. */
export const SDUI_NOTIFICATION_CHANNELS = [
  'in-app',
  'toast',
  'email',
  'sms',
  'push',
  'broadcast',
  'webhook',
] as const;
