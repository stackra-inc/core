/**
 * @file notification.interface.ts
 * @module @stackra/contracts/interfaces/notification
 * @description Notification dispatch definition and module options interfaces.
 */

import type { INotificationPayload } from './notification-channel.interface';

// ============================================================================
// Notification Definition
// ============================================================================

/**
 * Notification dispatch definition.
 *
 * Describes a notification to be sent: its type, which channels to use,
 * the template to render, and optional queue/delay configuration.
 */
export interface INotification {
  /** Notification type identifier (e.g., 'order.confirmed', 'user.welcome'). */
  readonly type: string;
  /** Channel names to dispatch through (e.g., ['email', 'push']). */
  readonly via: string[];
  /** Template name to render (resolved by TemplateService). */
  readonly template?: string;
  /** Data passed to the template for rendering. */
  readonly data?: Record<string, unknown>;
  /** Delay in ms before sending (enables queue-based dispatch). */
  readonly delay?: number;
  /** Queue name override (defaults to 'notifications'). */
  readonly queue?: string;
  /** Notification priority (affects delivery order in queued mode). */
  readonly priority?: 'low' | 'normal' | 'high' | 'critical';
}

// ============================================================================
// Module Options
// ============================================================================

/**
 * Configuration for `NotificationModule.forRoot()`.
 */
export interface INotificationModuleOptions {
  /** Whether to register as global module. Default: true. */
  readonly global?: boolean;
  /** Default channels to use when notification doesn't specify `via`. */
  readonly defaultChannels?: string[];
  /** Queue configuration for async dispatch. */
  readonly queue?: {
    /** Whether to enable queue-based dispatch. Default: false. */
    readonly enabled: boolean;
    /** Queue connection name. Default: 'notifications'. */
    readonly connection?: string;
  };
  /** Template configuration. */
  readonly templates?: {
    /** Template engine (handlebars, mjml, etc.). */
    readonly engine?: string;
    /** Whether to cache compiled templates. Default: true. */
    readonly cache?: boolean;
  };
}

/**
 * Async configuration options for `NotificationModule.forRootAsync()`.
 */
export interface INotificationModuleAsyncOptions {
  /** Modules to import for dependency injection. */
  readonly imports?: any[];
  /** Factory function returning INotificationModuleOptions. */
  readonly useFactory: (...args: any[]) => INotificationModuleOptions | Promise<INotificationModuleOptions>;
  /** Dependencies to inject into the factory function. */
  readonly inject?: any[];
}
