/**
 * @file metadata-keys.constant.ts
 * @module @stackra/events/core/constants
 * @description Metadata keys for event decorators and DI tokens.
 *   Used by `@OnEvent` and `@EventTransport` decorators to store metadata
 *   that the `EventSubscribersLoader` reads at bootstrap.
 */

import { EVENT_EMITTER, EVENT_EMITTER_CONFIG } from '@stackra/contracts';

// Re-export contracts token for convenience
export { EVENT_EMITTER_CONFIG };

// ════════════════════════════════════════════════════════════════════════════════
// Decorator Metadata Keys
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Metadata key for `@OnEvent()` decorator.
 *
 * Stored on the decorated METHOD via `@vivtel/metadata`. Value is an array
 * of `IOnEventMetadata` entries (stacking is supported — multiple `@OnEvent`
 * decorators on the same method).
 */
export const EVENT_LISTENER_METADATA = 'stackra:events:listener';

/**
 * Metadata key for `@EventTransport()` decorator.
 *
 * Stored on the decorated CLASS via `@vivtel/metadata`. Value is the
 * transport options object (`IEventTransportOptions`).
 */
export const EVENT_TRANSPORT_METADATA = 'stackra:events:transport';

// ════════════════════════════════════════════════════════════════════════════════
// DI Tokens
// ════════════════════════════════════════════════════════════════════════════════

/**
 * DI token for the `EventEmitter` service instance.
 *
 * Re-exported from `@stackra/contracts` so local code can keep
 * importing from the events package barrel. Inject via
 * `@Inject(EVENT_EMITTER)` or the convenience
 * `@InjectEventEmitter()` parameter decorator.
 */
export { EVENT_EMITTER };

// ── Auto-generated stubs for barrel exports ──
export const EVENT_TRANSPORT_REGISTRY_TOKEN = 'event.transport.registry.token' as const;
