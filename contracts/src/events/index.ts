/**
 * @file index.ts
 * @module @stackra/contracts/events
 * @description Barrel export for all client-side event constant objects.
 */

export { CACHE_EVENTS, type CacheEventName } from './cache.events';
export { COOKIE_EVENTS, type CookieEventName } from './cookie.events';
export { COORDINATOR_EVENTS, type CoordinatorEventName } from './coordinator.events';
export { FEATURE_FLAG_EVENTS, type FeatureFlagEventName } from './feature-flags.events';
export * from './health.events';
export { I18N_EVENTS, type I18nEventName } from './i18n.events';
export {
  LINK_EVENTS,
  LINK_EVENT_PREFIX,
  linkEventChannel,
  type LinkEventAction,
} from './link.events';
export { LOGGER_EVENTS, type LoggerEventName } from './logger.events';
export { MOBILE_PASS_EVENTS, type MobilePassEventName } from './mobile-pass.events';
export { NETWORK_EVENTS, type NetworkEventName } from './network.events';
export { NOTIFICATION_EVENTS, type NotificationEventName } from './notifications.events';
export { PREFERENCES_EVENTS, type PreferencesEventName } from './preferences.events';
export { PUBSUB_EVENTS, type PubsubEventName } from './pubsub.events';
export { PUSH_EVENTS, type PushEventName } from './push.events';
export { QUEUE_EVENTS, type QueueEventName } from './queue.events';
export { REALTIME_EVENTS, type RealtimeEventName } from './realtime.events';
export * from './redis.events';
export { SCHEDULER_EVENTS, type SchedulerEventName } from './scheduler.events';
export * from './sdui.events';
export {
  STATE_EVENTS,
  STATE_REGISTRY_EVENTS,
  type StateEventFragment,
  type StateRegistryEventName,
} from './state.events';
export { STORAGE_EVENTS, type StorageEventName } from './storage.events';
export { THEMING_EVENTS, type ThemingEventName } from './theming.events';
