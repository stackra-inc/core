/**
 * @file middleware-discovery.service.ts
 * @module @stackra/ssr/middleware/services
 * @description Auto-discovery of `@Middleware()` decorated classes.
 *
 *   At application bootstrap, walks every DI provider carrying the
 *   `MIDDLEWARE_DISCOVERY_KEY` flag and registers each with the
 *   `MiddlewareRegistry`. The class constructor itself is registered as
 *   the definition — `toPipe` resolves the instance from the container
 *   lazily at execution time.
 *
 *   Requires the `DISCOVERY_SERVICE` peer; fail-soft when the discovery
 *   package isn't wired.
 */

import { Injectable, Optional, Inject } from '@stackra/container';
import type { IDiscoveryService, OnApplicationBootstrap } from '@stackra/contracts';
import { DISCOVERY_SERVICE } from '@stackra/contracts';

import { MIDDLEWARE_DISCOVERY_KEY } from '../constants/metadata-keys.constant';
import type { MiddlewareClassRef } from '../interfaces/middleware-options.interface';
import { MiddlewareRegistry } from './middleware-registry.service';

/**
 * Discovers `@Middleware()` classes and registers them with the registry.
 */
@Injectable()
export class MiddlewareDiscovery implements OnApplicationBootstrap {
  public constructor(
    private readonly registry: MiddlewareRegistry,
    @Optional() @Inject(DISCOVERY_SERVICE) private readonly discovery?: IDiscoveryService
  ) {}

  public onApplicationBootstrap(): void {
    if (!this.discovery) return;
    const providers = this.discovery.getProvidersByMetadata(MIDDLEWARE_DISCOVERY_KEY);
    for (const wrapper of providers) {
      const instance = wrapper.instance as object | null;
      if (!instance) continue;
      const ctor = (instance as { constructor?: Function }).constructor;
      if (!ctor) continue;
      // Register the class constructor as a class-form middleware
      // definition. The registry reads the option metadata via reflect,
      // and `toPipe` resolves the instance from the container at run time.
      this.registry.register(ctor as unknown as MiddlewareClassRef);
    }
  }
}
