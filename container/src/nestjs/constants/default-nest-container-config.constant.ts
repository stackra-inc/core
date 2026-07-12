/**
 * @file default-null-config.constant.ts
 * @module @stackra/null/constants
 * @description Default configuration applied to every `NestContainerModule.forRoot()`
 *   registration. Currently empty — add real defaults here when the
 *   module starts taking user options with sensible fallbacks.
 *
 *   Use `mergeNestContainerConfig()` from `../utils` to apply the merge.
 */

/**
 * Default configuration applied to every `NestContainerModule` registration.
 *
 * Empty for now — package author adds real defaults later. Until then,
 * `mergeNestContainerConfig()` is an identity passthrough.
 */
export const DEFAULT_NEST_CONTAINER_CONFIG: Readonly<Record<string, never>> = Object.freeze({});
