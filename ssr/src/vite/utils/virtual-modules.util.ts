/**
 * @file virtual-modules.util.ts
 * @module @stackra/ssr/vite/utils
 * @description Virtual-module identifiers exposed by the Vite plugin.
 *
 *   Consumers can `import { routes } from 'virtual:stackra/routes'`
 *   without knowing where the actual file lives. The plugin resolves
 *   these ids to the files declared in `stackraSsr({...})` options.
 *
 *   `resolvedId(...)` prefixes the id with the null byte convention Vite
 *   uses for virtual modules — plugins recognise it and skip file-system
 *   resolution.
 */

/** Virtual id for the consumer's routes file. */
export const VIRTUAL_ROUTES_ID = 'virtual:stackra/routes';

/** Virtual id for the consumer's middleware config file. */
export const VIRTUAL_MIDDLEWARE_ID = 'virtual:stackra/middleware';

/** Prefix Vite uses to mark ids as virtual (skip fs resolution). */
export const VIRTUAL_PREFIX = '\0';

/** Return the resolved id form for a given virtual id. */
export function resolvedId(virtualId: string): string {
  return `${VIRTUAL_PREFIX}${virtualId}`;
}

/**
 * Return the module source string that re-exports from a real file.
 * Used inside the plugin's `load()` hook.
 */
export function reExportFrom(filePath: string): string {
  return `export * from ${JSON.stringify(filePath)};\n`;
}

/**
 * Fallback source for the middleware virtual module when the consumer
 * hasn't declared one — exposes an empty config so imports resolve.
 */
export const EMPTY_MIDDLEWARE_SOURCE = `export const middlewareConfig = { middleware: [], groups: [] };\n`;
