/**
 * @file global-registry.ts
 * @description Central registry for global helpers.
 *
 * Packages define their globals as a simple record and call `GlobalRegistry.register()`.
 * The registry handles attaching to globalThis, logging, and conflict detection.
 *
 * @example
 * ```ts
 * // In any package's service:
 * GlobalRegistry.register('i18n', {
 *   t: (key, args) => this.translate(key, args),
 *   trans: (key, args) => this.translate(key, args),
 *   __: (key, args) => this.translate(key, args),
 * });
 *
 * // Optionally register a namespace:
 * GlobalRegistry.register('i18n', {
 *   t: (key, args) => this.translate(key, args),
 * }, { namespace: 'i18n' });
 * ```
 */

import { Logger } from "@nestjs/common";

export interface RegisterOptions {
  /**
   * If provided, also attaches all functions under `globalThis[namespace]`.
   * e.g. namespace: 'i18n' → globalThis.i18n.t()
   */
  namespace?: string;

  /**
   * If true, overwrites existing globals without warning.
   * Default: false (logs a warning on conflict).
   */
  force?: boolean;
}

const logger = new Logger("GlobalRegistry");

/** Track what's been registered for debugging. */
const registered = new Map<string, string[]>();

export class GlobalRegistry {
  /**
   * Register functions on globalThis.
   *
   * @param owner - Package name for logging/debugging (e.g. 'i18n', 'cache').
   * @param globals - Record of function name → implementation.
   * @param options - Optional namespace and conflict behavior.
   */
  static register(
    owner: string,
    globals: Record<string, (...args: any[]) => any>,
    options: RegisterOptions = {},
  ): void {
    const g = globalThis as any;
    const names = Object.keys(globals);

    // Register top-level globals
    for (const name of names) {
      if (g[name] !== undefined && !options.force) {
        logger.warn(
          `Global "${name}" already exists (registered by another package). ` +
            `Use { force: true } to overwrite. Skipping for "${owner}".`,
        );
        continue;
      }
      g[name] = globals[name];
    }

    // Register under namespace if provided
    if (options.namespace) {
      if (!g[options.namespace]) g[options.namespace] = {};
      for (const name of names) {
        g[options.namespace][name] = globals[name];
      }
    }

    registered.set(owner, names);
    logger.log(
      `[${owner}] globals registered: ${names.join(", ")}` +
        (options.namespace ? ` (+ namespace: ${options.namespace})` : ""),
    );
  }

  /**
   * Check if a global is already registered.
   */
  static has(name: string): boolean {
    return (globalThis as any)[name] !== undefined;
  }

  /**
   * Get all registered owners and their globals (for debugging).
   */
  static getRegistered(): Map<string, string[]> {
    return new Map(registered);
  }

  /**
   * Unregister all globals for a given owner (useful for testing).
   */
  static unregister(owner: string): void {
    const names = registered.get(owner);
    if (!names) return;

    const g = globalThis as any;
    for (const name of names) {
      delete g[name];
    }
    registered.delete(owner);
  }
}
