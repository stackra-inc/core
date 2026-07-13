/**
 * @file middleware.decorator.ts
 * @module @stackra/ssr/middleware/decorators
 * @description Class decorator that marks a class for auto-registration
 *   as a named middleware.
 *
 *   The decorated class must expose a `handle(ctx, next, ...params)`
 *   method. `MiddlewareDiscovery` picks up decorated classes at
 *   bootstrap, reads the metadata, and registers them with
 *   `MiddlewareRegistry` so they become referenceable by name from
 *   routes and groups.
 *
 *   @example
 *   ```typescript
 *   @Middleware({ name: 'auth', priority: 100, stage: 'http' })
 *   @Injectable()
 *   class AuthMiddleware {
 *     constructor(@Inject(AUTH_SERVICE) private auth: AuthService) {}
 *     async handle(ctx: HttpContext, next: MiddlewareNext) {
 *       if (!this.auth.check()) redirect('/login');
 *       return next();
 *     }
 *   }
 *   ```
 */

import { defineMetadata } from '@vivtel/metadata';

import {
  MIDDLEWARE_DISCOVERY_KEY,
  MIDDLEWARE_METADATA_KEY,
} from '../constants/metadata-keys.constant';
import type { MiddlewareOptions } from '../interfaces/middleware-options.interface';

/**
 * Metadata carried by `@Middleware()` — the same option surface as the
 * options-form of `defineMiddleware`, minus the `handle`/`resolve`
 * fields (the decorated class *is* the handler).
 */
export type MiddlewareDecoratorOptions = Omit<MiddlewareOptions, 'handle' | 'resolve'>;

/**
 * Mark a class for automatic registration as a named middleware.
 *
 * @param options - Middleware metadata (name, priority, stage, ...).
 *   `name` is required for discovery — anonymous middleware can't be
 *   referenced.
 * @returns A class decorator
 */
export function Middleware(options: MiddlewareDecoratorOptions): ClassDecorator {
  return (target: Function) => {
    // Store the option payload the registry reads, and a discovery flag.
    defineMetadata(MIDDLEWARE_METADATA_KEY, options, target);
    defineMetadata(MIDDLEWARE_DISCOVERY_KEY, true, target);
  };
}
