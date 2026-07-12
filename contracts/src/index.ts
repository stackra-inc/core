/**
 * @file index.ts
 * @module @stackra/contracts
 * @description Public API for @stackra/contracts — the shared vocabulary
 *   of the Stackra client-side framework.
 *
 *   Contents:
 *   - Tokens: our own DI tokens (APPLICATION, APP_CONFIG, DISCOVERY_SERVICE,
 *     LOGGER_MANAGER, CACHE_MANAGER, etc.)
 *   - Interfaces: contracts for every client domain (cache, container,
 *     cookie, coordinator, events, feature-flags, health, http, i18n,
 *     link, logger, mobile-pass, navigation, network, notification,
 *     preferences, pubsub, push, queue, realtime, redis, scheduler, sdui,
 *     state, storage, theming)
 *   - Event constants + typed payloads for every domain event
 *   - Re-exports from @stackra/nestjs-types for provider/module shapes
 *
 *   Zero runtime — the tokens are Symbol.for(...) and everything else is
 *   type-only. Consumers import from `@stackra/contracts` and never need
 *   to depend on @nestjs/common for types.
 */

// ============================================================================
// Tokens
// ============================================================================
export * from './tokens';

// ============================================================================
// Events
// ============================================================================
export * from './events';

// ============================================================================
// Interfaces
// ============================================================================
export * from './interfaces';

// ============================================================================
// Enums (SDUI)
// ============================================================================
export type {
  SduiMode,
  HeroUIColor,
  HeroUIVariant,
  HeroUISize,
  SduiNotificationChannel,
} from './enums/sdui';
export {
  SDUI_MODES,
  HEROUI_COLORS,
  HEROUI_VARIANTS,
  HEROUI_SIZES,
  SDUI_NOTIFICATION_CHANNELS,
} from './enums/sdui';

// ============================================================================
// Types
// ============================================================================
export { LogLevel, LOG_LEVEL_PRIORITY } from './types/logger/log-level.enum';
export type { LogContext } from './types/logger/log-context.type';
export type { ITranslatableKey, ITranslatableValues, TranslatableText } from './types/sdui';

// ============================================================================
// Re-exports from @stackra/nestjs-types
// ============================================================================
export type {
  Type,
  Abstract,
  InjectionToken,
  ForwardReference,
  OptionalFactoryDependency,
  DynamicModule,
  ModuleMetadata,
  ScopeOptions,
  Provider,
  ClassProvider,
  ValueProvider,
  FactoryProvider,
  ExistingProvider,
  IAsyncModuleOptions,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  BeforeApplicationShutdown,
} from '@stackra/nestjs-types';

// Legacy aliases (container uses these names)
export type { Provider as IProvider } from '@stackra/nestjs-types';
export { Scope as IScope, Scope, ShutdownSignal } from '@stackra/nestjs-types';
