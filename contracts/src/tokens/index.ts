/**
 * @file index.ts
 * @module @stackra/contracts/tokens
 * @description Barrel export for every DI token shipped by contracts.
 */

export { APPLICATION } from './application.token';
export { APP_CONFIG } from './app-config.token';
export { CACHE_MANAGER, CACHE_CONFIG, CACHE_STORE_METADATA_KEY } from './cache.tokens';
export { COLLABORATION_ROOM_MANAGER, COLLABORATION_CONFIG } from './collaboration.tokens';
export { COORDINATOR_CONFIG, TAB_COORDINATOR } from './coordinator.tokens';
export { DISCOVERY_SERVICE } from './discovery-service.token';
export { EVENT_EMITTER, EVENT_EMITTER_CONFIG } from './events.tokens';
export {
  // NOTE: HTTP event names live in ../events/http.events.ts (HTTP_EVENTS).
  HTTP_MANAGER,
  HTTP_CLIENT,
  HTTP_CONFIG,
  DEFAULT_HTTP_CONNECTION_TOKEN,
  HTTP_TOKEN_PROVIDER,
  getHttpConnectionToken,
} from './http.tokens';
export { LOGGER_MANAGER, LOGGER_CONFIG } from './logger.tokens';
export { MIDDLEWARE_REGISTRY, MIDDLEWARE_RESOLVER, MIDDLEWARE_CONFIG } from './middleware.tokens';
export {
  QUEUE_MANAGER,
  QUEUE_CONFIG,
  PROCESSOR_METADATA_KEY,
  ON_JOB_EVENT_METADATA_KEY,
} from './queue.tokens';
export { REALTIME_MANAGER, REALTIME_CONFIG } from './realtime.tokens';
export {
  SCHEDULER_SERVICE,
  SCHEDULER_CONFIG,
  TASK_RUNNER,
  SCHEDULED_METADATA_KEY,
} from './scheduler.tokens';
export {
  ROUTE_REGISTRY,
  API_ROUTE_REGISTRY,
  SSR_RENDERER,
  SSR_CONFIG,
  ROUTE_METADATA_KEY,
  API_ROUTE_METADATA_KEY,
  SEO_SERVICE,
  SEO_CONFIG,
} from './ssr.tokens';
