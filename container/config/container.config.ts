/**
 * @file container.config.ts
 * @module @stackra/container/config
 * @description Container bootstrap configuration template.
 *   Defines the options passed to `ApplicationFactory.create()`.
 *
 *   Copy this file to your app's `src/config/container.config.ts` and
 *   adjust values for your environment.
 */

import { defineConfig } from '@stackra/container';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Application container configuration.
 *
 * Passed directly to `ApplicationFactory.create(AppModule, containerConfig)`.
 * All fields are optional — sensible defaults are applied automatically.
 */
export const containerConfig = defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Debug Mode
  |--------------------------------------------------------------------------
  |
  | When true, exposes the application instance on `window[globalName]`
  | for browser devtools inspection:
  |   window.__APP__.get(UserService)
  |
  */
  debug: true,

  /*
  |--------------------------------------------------------------------------
  | Global Name
  |--------------------------------------------------------------------------
  |
  | The window property name for debug access.
  | Only used when `debug` is true.
  |
  */
  globalName: '__APP__',

  /*
  |--------------------------------------------------------------------------
  | Shutdown Hooks
  |--------------------------------------------------------------------------
  |
  | Register `beforeunload` / `SIGTERM` shutdown hooks automatically.
  | Triggers `onModuleDestroy` and `onApplicationShutdown` on all providers.
  |
  */
  shutdownHooks: true,

  /*
  |--------------------------------------------------------------------------
  | Resolution Logging
  |--------------------------------------------------------------------------
  |
  | Prints the full dependency graph during bootstrap.
  | Shows: modules → providers → scopes → dependencies → lifecycle hooks.
  | Disable in production for performance.
  |
  */
  logging: {
    enabled: true,
    resolution: true,
    lifecycle: true,
    timing: true,
    graph: true,
    colors: true,
  },
});
