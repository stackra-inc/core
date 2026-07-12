/**
 * @file index.ts
 * @module @stackra/contracts
 * @description Public API for @stackra/contracts.
 *   The shared vocabulary of the monorepo.
 *
 *   - Tokens: DI tokens for every foundation package
 *     (APPLICATION, APP_CONFIG, DISCOVERY_SERVICE, HTTP_SERVICE,
 *     DATA_OPTIONS_TOKEN, NOTIFICATION_SERVICE,
 *     ACCESS_CONTROL_SERVICE, ECHO_SERVICE, ...)
 *   - Interfaces: public contracts for every foundation package
 *     (IHttpService, IResourceProvider, INotificationService,
 *     IAccessControlService, IEchoService, ...)
 *   - Enums: shared vocab enums (FilterOperator, SortDirection,
 *     MutationMode, HttpMethod, LiveMode, Guard, NotificationType,
 *     FlagKind, OverrideDecision, ResolutionSource, ...)
 *   - Errors: shared error classes (HttpError, AccessDeniedError,
 *     RoleMismatchError)
 *   - Re-exports: types/interfaces from @stackra/nestjs-types
 *     so consumers import from one place.
 *
 * Downstream packages import from `@stackra/contracts` ONLY
 * for public types + tokens + enums + errors. Concrete
 * implementations (services, hooks, providers, components)
 * still live in their per-domain package.
 */

// ============================================================================
// Container-scoped tokens (ours — not in @nestjs/common)
// ============================================================================
export { APPLICATION } from './tokens/application.token';
export { APP_CONFIG } from './tokens/app-config.token';
export { DISCOVERY_SERVICE } from './tokens/discovery-service.token';

// ============================================================================
// Container-scoped interfaces (ours — not in @nestjs/common)
// ============================================================================
export type { IApplication } from './interfaces/container/application.interface';
export type { IApplicationOptions } from './interfaces/container/application-options.interface';
export type { IContainer } from './interfaces/container/container.interface';
export type { IDiscoveryService } from './interfaces/discovery/discovery-service.interface';
export type { IDiscoveryProvider } from './interfaces/discovery/discovery-provider.interface';

// ============================================================================
// Re-exports from @stackra/nestjs-types (so packages import from one place)
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
