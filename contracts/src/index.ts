/**
 * @file index.ts
 * @module @stackra/contracts
 * @description Public API for @stackra/contracts.
 *
 *   Zero-runtime vocabulary shared across every @stackra/* package.
 *
 *   Contents:
 *   - Tokens: APPLICATION, APP_CONFIG, DISCOVERY_SERVICE, LOGGER_MANAGER, LOGGER_CONFIG
 *   - Container interfaces: IApplication
 *   - Discovery interfaces: IDiscoveryService, IDiscoveryProvider
 *   - Event interfaces: IEventEmitter
 *   - Logger interfaces + types: ILogger, ILoggerManager, ILogEntry,
 *     ILogReporter, ILogEnricher, ILogFormatter, ILogChannelConfig,
 *     ILoggerModuleConfig, LogLevel, LogContext, LOG_LEVEL_PRIORITY,
 *     LOGGER_EVENTS
 *   - Re-exports from @stackra/nestjs-types (Type, Provider variants,
 *     lifecycle hook interfaces, DynamicModule, etc.) so consumers
 *     don't need to depend on @nestjs/common for types
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
// Types
// ============================================================================
export { LogLevel, LOG_LEVEL_PRIORITY } from './types/logger/log-level.enum';
export type { LogContext } from './types/logger/log-context.type';

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
