/**
 * @file event-subscriber-map.type.ts
 * @module @stackra/events/core/interfaces
 * @description Type definition for event subscriber mapping.
 */

/** Map of event name patterns to handler method names on the subscriber class. */
export type IEventSubscriberMap = Record<string, string>;
