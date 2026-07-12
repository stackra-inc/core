/**
 * @file index.ts
 * @module @stackra/contracts/tokens
 * @description Barrel export for all client-side DI tokens.
 */

export { APPLICATION } from './application.token';
export { APP_CONFIG } from './app-config.token';
export { DISCOVERY_SERVICE } from './discovery-service.token';

// Cache
export { CACHE_MANAGER, CACHE_CONFIG, CACHE_STORE_METADATA_KEY } from './cache.tokens';

// Cookie
export { COOKIE_JAR, COOKIE_ENCRYPTER, COOKIE_CONFIG, COOKIE_SERVICE } from './cookie.tokens';

// Coordinator
export { TAB_COORDINATOR, COORDINATOR_CONFIG } from './coordinator.tokens';

// Events
export { EVENT_EMITTER, EVENT_EMITTER_CONFIG } from './events.tokens';

// Feature flags
export {
  FEATURE_FLAGS_CONFIG,
  FEATURE_FLAG_SERVICE,
  PERMISSION_RESOLVER,
} from './feature-flags.tokens';

// Health
export {
  HEALTH_CONFIG,
  HEALTH_RESULT_STORE,
  HEALTH_METRICS,
  HEALTH_INDICATOR_METADATA_KEY,
  HEALTH_REDIS_CONNECTION,
} from './health.tokens';

// I18n
export {
  I18N_CONFIG,
  I18N_MANAGER,
  I18N_LOCALE_SERVICE,
  I18N_LOCALE_STORAGE,
  I18N_DIRECTION_SERVICE,
  I18N_DIRECTION_ADAPTER,
  I18N_SERVICE,
  NEST_I18N_CONFIG,
  I18N_RESOLVERS,
} from './i18n.tokens';

// Logger
export { LOGGER_MANAGER, LOGGER_CONFIG } from './logger.tokens';

// Mobile pass
export {
  MOBILE_PASS_CONFIG,
  MOBILE_PASS_SERVICE,
  MOBILE_PASS_BUILDER_REGISTRY,
  MOBILE_PASS_CUSTOM_BUILDERS,
  MOBILE_PASS_PKPASS_GENERATOR,
  MOBILE_PASS_APPLE_PUSH,
  MOBILE_PASS_GOOGLE_CLIENT,
} from './mobile-pass.tokens';

// Navigation
export {
  NAVIGATION_CONFIG,
  NAVIGATION_SERVICE,
  NAVIGATION_CACHE,
  NAV_ANALYTICS,
  MENU_TRANSFORMER_PIPELINE,
  MENU_TRANSFORMER_REGISTRY,
  ICON_RESOLVER_REGISTRY,
  MENU_BLOCK_REGISTRY,
  BEHAVIOR_REGISTRY,
  PREDICATE_REGISTRY,
  SHORTCUT_REGISTRY,
  KEYBOARD_HINTS_STORE,
} from './navigation.tokens';

// Network
export { NETWORK_BINDINGS, NETWORK_SERVICE, NETWORK_CONFIG } from './network.tokens';

// Notification
export {
  NOTIFICATION_SERVICE,
  NOTIFICATION_CONFIG,
  CHANNEL_REGISTRY,
} from './notification.tokens';

// Preferences
export {
  PREFERENCES_MANAGER,
  PREFERENCES_CONFIG,
  PREFERENCES_STORE_METADATA_KEY,
} from './preferences.tokens';

// PubSub
export { PUBSUB_SERVICE } from './pubsub.tokens';

// Push
export { PUSH_MANAGER, PUSH_SERVICE, PUSH_CONFIG } from './push.tokens';

// Queue (client offline queue)
export {
  QUEUE_MANAGER,
  QUEUE_CONFIG,
  PROCESSOR_METADATA_KEY,
  ON_JOB_EVENT_METADATA_KEY,
} from './queue.tokens';

// Realtime
export { REALTIME_MANAGER, REALTIME_CONFIG } from './realtime.tokens';

// Redis (client-side HTTP Redis, e.g. Upstash)
export {
  REDIS_CLIENT,
  TENANT_CONFIG_REPOSITORY,
  REDIS_MANAGER,
  REDIS_CONFIG,
  REDIS_LOCK_SERVICE,
  REDIS_TRANSPORT_CONFIG,
  STREAM_PROCESSOR_METADATA_KEY,
  NEST_REDIS_BACKENDS_REGISTRATION,
} from './redis.tokens';

// Scheduler
export {
  SCHEDULER_SERVICE,
  SCHEDULER_CONFIG,
  SCHEDULED_METADATA_KEY,
  TASK_RUNNER,
} from './scheduler.tokens';

// SDUI
export * from './sdui.tokens';

// State
export { STATE_REGISTRY } from './state.tokens';

// Storage
export { STORAGE_SERVICE, STORAGE_CONFIG } from './storage.tokens';

// Theming
export {
  THEME_BINDINGS,
  THEMING_CONFIG,
  THEME_REGISTRY,
  THEME_TOKEN_STORE,
  THEME_SERVICE,
} from './theming.tokens';
