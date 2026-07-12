/**
 * Metadata Keys & Constants
 *
 * Re-exports NestJS metadata constants from `@stackra/nestjs-types` and
 * defines the two container-specific constants needed by the discovery engine.
 *
 * @module constants/tokens
 */

/**
 * Prefix used for keys produced by `DiscoveryService.createDecorator()`.
 */
export const DISCOVERABLE_DECORATOR_KEY_PREFIX = '@discoverable:';

/**
 * Default global variable name used to expose the `ApplicationContext`
 * on `window` for browser console debugging.
 *
 * @default "__APP__"
 */
export const DEFAULT_GLOBAL_NAME = '__APP__';
