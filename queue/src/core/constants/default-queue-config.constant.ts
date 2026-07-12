/**
 * @file default-queue-config.constant.ts
 * @module @stackra/queue/constants
 * @description Default configuration applied to every `QueueModule.forRoot()`
 *   registration. Currently empty — add real defaults here when the
 *   module starts taking user options with sensible fallbacks.
 *
 *   Use `mergeQueueConfig()` from `../utils` to apply the merge.
 */

/**
 * Default configuration applied to every `QueueModule` registration.
 *
 * Empty for now — package author adds real defaults later. Until then,
 * `mergeQueueConfig()` is an identity passthrough.
 */
export const DEFAULT_QUEUE_CONFIG: Readonly<Record<string, never>> = Object.freeze({});
