/**
 * @file index.ts
 * @module @stackra/container/nestjs
 * @description NestJS adapter for the @stackra container discovery system.
 *   Provides NestDiscoveryService (IDiscoveryService implementation backed
 *   by @nestjs/core's DiscoveryService) and NestContainerModule for global
 *   registration in NestJS applications.
 *
 *   This enables platform-agnostic auto-discovery of decorated providers
 *   (reporters, processors, listeners, cache stores, etc.) in NestJS apps.
 */

// ============================================================================
// Module
// ============================================================================
export { NestContainerModule } from './nest-container.module';

// ============================================================================
// Services
// ============================================================================
export { NestDiscoveryService } from './services/nest-discovery.service';

// ============================================================================
// Application Bootstrap
// ============================================================================
export { Application, ApplicationBuilder } from './application';
export type {
  IApplicationOptions,
  ICorsOptions,
  IValidationOptions,
  ISwaggerOptions,
  IShutdownOptions,
  IVersioningOptions,
} from './application';

// ============================================================================
// Re-export contracts (convenience)
// ============================================================================
export { DISCOVERY_SERVICE, APPLICATION } from '@stackra/contracts';
export type { IDiscoveryService, IDiscoveryProvider, IApplication } from '@stackra/contracts';
export * from './nest-discovery.service';
export * from './constants';
export * from './interfaces';
export * from './services';
export * from './types';
export * from './utils';
