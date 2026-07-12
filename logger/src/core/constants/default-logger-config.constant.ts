/**
 * @file default-logger-config.constant.ts
 * @module @stackra/logger/constants
 * @description Default configuration applied to every `LoggerModule.forRoot()`
 *   registration. Currently empty — add real defaults here when the
 *   module starts taking user options with sensible fallbacks.
 *
 *   Use `mergeLoggerConfig()` from `../utils` to apply the merge.
 */

/**
 * Default configuration applied to every `LoggerModule` registration.
 *
 * Empty for now — package author adds real defaults later. Until then,
 * `mergeLoggerConfig()` is an identity passthrough.
 */
export const DEFAULT_LOGGER_CONFIG: Readonly<Record<string, never>> = Object.freeze({});
