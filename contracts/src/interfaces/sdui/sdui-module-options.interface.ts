/**
 * @file sdui-module-options.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Configuration shape for `SduiModule.forRoot()`. The
 *   shape mirrors the platform standard (per `module-patterns.md`):
 *   `global` first, `logging` second, then feature-specific options.
 */

import type { ISduiZoneDescriptor } from './sdui-zone-descriptor.interface';

/**
 * Logging level for the SDUI module.
 */
export type SduiLogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

/**
 * Cache backend hint. Memory is the default for dev / tests; redis
 * is the production choice. The actual backend lives in
 * `@stackra/cache` — SDUI never implements the cache itself.
 */
export type SduiCacheBackend = 'memory' | 'redis';

/**
 * Configuration consumed by `SduiModule.forRoot()`.
 */
export interface ISduiModuleOptions {
  /**
   * Register the module globally. SDUI is almost always global (the
   * registries are shared across feature modules).
   */
  readonly global?: boolean;

  /** Logging verbosity for SDUI's internal services. */
  readonly logging?: SduiLogLevel;

  /**
   * URL prefix the controllers mount under (default: `'/api/sdui'`).
   * Useful when multiple SDUI deployments coexist behind the same
   * gateway.
   */
  readonly prefix?: string;

  /**
   * Default cache backend identifier — passed to `@stackra/cache`
   * when constructing the cache manager.
   */
  readonly cacheBackend?: SduiCacheBackend;

  /**
   * Default cache TTL in seconds. Documents may override per-
   * document via `meta.cache.ttl`.
   */
  readonly defaultCacheTtl?: number;

  /**
   * Authentication mount path used by the built-in auth scenes.
   * Defaults to `'/api/auth'`. Threaded to scenes via the
   * `ISduiSceneBuildContext.config` bag.
   */
  readonly authMountPath?: string;

  /**
   * Social-auth providers surfaced on auth scenes (`['google',
   * 'apple', 'github', …]`). Empty when MFA-only / SSO-only.
   */
  readonly socialProviders?: readonly string[];
}

/**
 * Configuration for `SduiModule.forFeature()`. Used by feature
 * modules to contribute zones, custom scenes, layouts, and actions
 * without modifying the global module config.
 */
export interface ISduiFeatureOptions {
  /** Zones contributed by this feature module. */
  readonly zones?: readonly ISduiZoneDescriptor[];
}
