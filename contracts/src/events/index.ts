/**
 * @file index.ts
 * @module @stackra/contracts/events
 * @description Barrel export for every event-constant object shipped by contracts.
 */

export { CACHE_EVENTS, type CacheEventName } from './cache.events';
export { COLLABORATION_EVENTS, type CollaborationEventName } from './collaboration.events';
export { COORDINATOR_EVENTS, type CoordinatorEventName } from './coordinator.events';
export { HTTP_EVENTS, type HttpEventName } from './http.events';
export { LOGGER_EVENTS, type LoggerEventName } from './logger.events';
export { MIDDLEWARE_EVENTS, type MiddlewareEventName } from './middleware.events';
export { QUEUE_EVENTS, type QueueEventName } from './queue.events';
export { REALTIME_EVENTS, type RealtimeEventName } from './realtime.events';
export { SCHEDULER_EVENTS, type SchedulerEventName } from './scheduler.events';
export { SSR_EVENTS, type SsrEventName } from './ssr.events';
