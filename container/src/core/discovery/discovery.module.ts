/**
 * DiscoveryModule — Global module that exposes `DiscoveryService`.
 *
 * Import once at the root and the service is available everywhere:
 *
 * ```typescript
 * @Module({ imports: [DiscoveryModule] })
 * class AppModule {}
 * ```
 *
 * Mirrors NestJS's `DiscoveryModule` at `packages/core/discovery/discovery-module.ts`.
 *
 * Also registers `ContainerDiscoveryService` bound to the `DISCOVERY_SERVICE`
 * token from `@stackra/contracts`, enabling any package to inject the
 * platform-agnostic discovery service via `@Inject(DISCOVERY_SERVICE)`.
 *
 * @module discovery/discovery-module
 */

import { DISCOVERY_SERVICE } from '@stackra/contracts';

import { Global } from '../decorators/global.decorator';
import { Module } from '../decorators/module.decorator';
import { DiscoveryService } from './discovery.service';
import { ContainerDiscoveryService } from './container-discovery.service';

/**
 * Global module exporting {@link DiscoveryService} and {@link ContainerDiscoveryService}.
 *
 * The service depends on `ModuleContainer`, which `ApplicationFactory.create()`
 * registers as a value provider on every module — so `DiscoveryModule`
 * can be imported anywhere without extra wiring.
 *
 * Binds `DISCOVERY_SERVICE` token to `ContainerDiscoveryService` so that
 * loader services (ReporterLoader, CacheStoreLoader, etc.) can inject it
 * platform-agnostically.
 */
@Global()
@Module({
  providers: [
    DiscoveryService,
    ContainerDiscoveryService,
    { provide: DISCOVERY_SERVICE, useExisting: ContainerDiscoveryService },
  ],
  exports: [DiscoveryService, ContainerDiscoveryService, DISCOVERY_SERVICE],
})
export class DiscoveryModule {}
