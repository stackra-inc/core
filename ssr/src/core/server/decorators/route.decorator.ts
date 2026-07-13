/**
 * @file route.decorator.ts
 * @module @stackra/ssr/core/server/decorators
 * @description Class decorator that marks a class for auto-registration
 *   as a UI route.
 *
 *   The decorated class must expose a `render(): ReactNode` method (used
 *   as the route's `Component`) — or implement `loader`/`action` methods
 *   for data routes without a component. Discovery reads the metadata,
 *   builds a `StackraRoute` from the class, and registers it with the
 *   `RouteRegistry`.
 *
 *   @example
 *   ```typescript
 *   @Route({ path: '/dashboard', middleware: [requireAuth],
 *            meta: { title: 'Dashboard' } })
 *   @Injectable()
 *   class DashboardRoute {
 *     constructor(@Inject(USER_SERVICE) private users: UserService) {}
 *     render() { return <DashboardPage users={this.users.list()} />; }
 *   }
 *   ```
 */

import { defineMetadata } from '@vivtel/metadata';
import { ROUTE_METADATA_KEY } from '@stackra/contracts';

import type { RouteMetadata } from '../interfaces/route-metadata.interface';

/**
 * Mark a class for automatic registration as a UI route.
 *
 * @param options - Route configuration (path, middleware, meta, ...)
 * @returns A class decorator
 */
export function Route(options: RouteMetadata): ClassDecorator {
  return (target: Function) => {
    defineMetadata(ROUTE_METADATA_KEY, options, target);
  };
}
