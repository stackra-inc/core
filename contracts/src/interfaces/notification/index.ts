/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/notification
 * @description Barrel for notification contracts.
 */

export type {
  INotificationChannel,
  INotificationRecipient,
  INotificationPayload,
  IChannelResult,
} from './notification-channel.interface';

export type {
  INotification,
  INotificationModuleOptions,
  INotificationModuleAsyncOptions,
} from './notification.interface';

export type {
  INotificationSentPayload,
  INotificationFailedPayload,
  INotificationQueuedPayload,
  INotificationChannelRegisteredPayload,
} from './notification-event-payloads.interface';

export type {
  INotificationTemplate,
  ITemplateEmailContent,
  ITemplateSmsContent,
  ITemplatePushContent,
  ITemplateSlackContent,
  ITemplateInAppContent,
  IPlaceholderResolver,
  IRenderedTemplate,
} from './notification-template.interface';
