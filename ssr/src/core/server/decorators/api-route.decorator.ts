/**
 * @file api-route.decorator.ts
 * @module @stackra/ssr/core/server/decorators
 * @description Class decorator that marks a class for auto-registration
 *   as an API route.
 *
 *   The decorated class must expose a `handle(ctx: HttpContext)` method.
 *   Discovery constructs a `StackraApiRoute` from the metadata and
 *   registers it with `ApiRouteRegistry`.
 *
 *   @example
 *   ```typescript
 *   @ApiRoute({ path: '/api/users/me', method: 'GET', middleware: [requireAuth] })
 *   @Injectable()
 *   class GetCurrentUserRoute {
 *     constructor(@Inject(AUTH_SERVICE) private auth: AuthService) {}
 *     async handle(ctx: HttpContext) {
 *       return this.auth.currentUser();
 *     }
 *   }
 *   ```
 */

import { defineMetadata } from '@vivtel/metadata';
import { API_ROUTE_METADATA_KEY } from '@stackra/contracts';

import type { ApiRouteMetadata } from '../interfaces/route-metadata.interface';

/**
 * Mark a class for automatic registration as an API route.
 *
 * @param options - API route configuration (path, method, middleware, ...)
 * @returns A class decorator
 */
export function ApiRoute(options: ApiRouteMetadata): ClassDecorator {
  return (target: Function) => {
    defineMetadata(API_ROUTE_METADATA_KEY, options, target);
  };
}
