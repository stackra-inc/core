/**
 * @file index.ts
 * @module @stackra/events
 * @description Public API for the events package (core entry point).
 *   Lightweight zero-dependency event bus with wildcard matching,
 *   `@OnEvent` auto-discovery, and `@EventTransport` bridging.
 */

// ════════════════════════════════════════════════════════════════════════════════
// Module
// ════════════════════════════════════════════════════════════════════════════════
export { EventEmitterModule } from './events.module';

// ════════════════════════════════════════════════════════════════════════════════
// Services
// ════════════════════════════════════════════════════════════════════════════════
export { EventEmitter } from './services';
export type { EventListener } from './interfaces/listener-entry.interface';
export { EventTransportRegistry } from './services';
export { EventSubscribersLoader } from './services';

// ════════════════════════════════════════════════════════════════════════════════
// Decorators
// ════════════════════════════════════════════════════════════════════════════════
export { OnEvent } from './decorators';
export { EventTransport } from './decorators';
export { InjectEventEmitter } from './decorators';
export { EventSubscriber, EVENT_SUBSCRIBER_METADATA } from './decorators';

// ════════════════════════════════════════════════════════════════════════════════
// Errors
// ════════════════════════════════════════════════════════════════════════════════
export { EventEmitterError } from './errors';
export { EventListenerError } from './errors';
export { EventTransportError } from './errors';

// ════════════════════════════════════════════════════════════════════════════════
// Constants
// ════════════════════════════════════════════════════════════════════════════════
export {
  EVENT_EMITTER,
  EVENT_EMITTER_CONFIG,
  EVENT_TRANSPORT_REGISTRY_TOKEN,
  EVENT_LISTENER_METADATA,
  EVENT_TRANSPORT_METADATA,
} from './constants';

// ════════════════════════════════════════════════════════════════════════════════
// Interfaces
// ════════════════════════════════════════════════════════════════════════════════
export type { IEventEmitterConfig } from './interfaces';
export type { IOnEventMetadata, IOnEventOptions } from './interfaces';
export type { IEventTransportOptions, IEventTransport } from './interfaces';
export type { IEventEmitterSync } from '@stackra/contracts';

// ════════════════════════════════════════════════════════════════════════════════
// Utilities
// ════════════════════════════════════════════════════════════════════════════════
export { defineConfig } from './utils';

// ════════════════════════════════════════════════════════════════════════════════
// Commands
// ════════════════════════════════════════════════════════════════════════════════
// CLI commands live in a separate console/CLI package and are auto-discovered
// via @Command() decorators — no exports needed here.
