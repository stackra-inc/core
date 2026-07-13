/**
 * @file route-registry.service.ts
 * @module @stackra/ssr/core/server/services
 * @description The UI route registry — the source of truth for every
 *   `StackraRoute` known to the runtime.
 *
 *   Routes arrive from three sources — declarative `forRoot({ routes })`,
 *   `forFeature({ routes })`, and discovery of `@Route()` classes.
 *   Consumers reach the tree via `getTree()`; the client-side
 *   `<StackraRouter>` uses it as the input to `createBrowserRouter`.
 *
 *   Populates itself in `onModuleInit()` from the injected `SSR_CONFIG`.
 *   Feature modules and discovery add more entries at wire time via
 *   `registerMany(...)` — no synthetic bootstrap class is used.
 */

import { Inject, Injectable, Optional } from '@stackra/container';
import type { ILoggerManager } from '@stackra/contracts';
import { LOGGER_MANAGER } from '@stackra/contracts';

import type { StackraRoute } from '../../../react/types/stackra-route.type';
import type { RouteDescriptor, RouteSource } from '../interfaces/route-descriptor.interface';

/**
 * The UI route registry.
 *
 * Purely imperative — populated by `RouteDiscovery` (scanning `@Route()`
 * classes) and by `SsrModule.forFeature({ routes })` at wire time. It
 * holds no config and implements no lifecycle hook.
 *
 * Registered routes are stored as flat `RouteDescriptor`s. `getTree()`
 * lazily rebuilds a nested `StackraRoute[]` tree — routes whose metadata
 * specifies a `parent` path are nested underneath the matching parent,
 * otherwise they land at the top level.
 */
@Injectable()
export class RouteRegistry {
  private readonly descriptors: RouteDescriptor[] = [];
  private counter = 0;

  public constructor(
    @Optional() @Inject(LOGGER_MANAGER) private readonly loggerManager?: ILoggerManager
  ) {}

  /**
   * Register a single route. Called by feature modules and
   * `RouteDiscovery`.
   */
  public register(route: StackraRoute, source: RouteSource, origin?: string): void {
    this.descriptors.push({
      route,
      source,
      origin,
      declarationIndex: this.counter++,
    });
  }

  /**
   * Register many routes at once. Preserves order.
   */
  public registerMany(routes: readonly StackraRoute[], source: RouteSource, origin?: string): void {
    for (const route of routes) {
      this.register(route, source, origin);
    }
  }

  /**
   * All registered descriptors in declaration order.
   */
  public list(): readonly RouteDescriptor[] {
    return this.descriptors;
  }

  /**
   * Build the nested `StackraRoute[]` tree consumed by React Router.
   *
   * Routes carry a `path` field. Any descriptor whose route has a
   * matching `parent` is inserted as a child of the parent route.
   * Everything else lands at the top level. Sibling order preserves
   * declaration order.
   */
  public getTree(): readonly StackraRoute[] {
    if (this.descriptors.length === 0) return [];

    const byPath = new Map<string, StackraRoute[]>();
    const rootChildren: StackraRoute[] = [];

    for (const desc of this.descriptors) {
      const parentPath = (desc.route as StackraRoute & { parent?: string }).parent;
      if (parentPath) {
        const list = byPath.get(parentPath) ?? [];
        list.push(desc.route);
        byPath.set(parentPath, list);
      } else {
        rootChildren.push(desc.route);
      }
    }

    return rootChildren.map((route) => this.attachChildren(route, byPath));
  }

  /**
   * Reset the registry — test-only escape hatch.
   */
  public clear(): void {
    this.descriptors.length = 0;
    this.counter = 0;
  }

  /**
   * Recursively attach children based on `byPath` map keyed on route
   * `path`. Immutable — returns a new object.
   */
  private attachChildren(route: StackraRoute, byPath: Map<string, StackraRoute[]>): StackraRoute {
    const routePath = route.path;
    const children = routePath ? byPath.get(routePath) : undefined;
    const existing = route.children ?? [];
    const nested = children
      ? [...existing, ...children.map((c) => this.attachChildren(c, byPath))]
      : existing.map((c) => this.attachChildren(c, byPath));
    if (nested.length === existing.length && !children) return route;
    return { ...route, children: nested };
  }

  /**
   * Emit a warning via the optional logger. Fail-soft when absent.
   * Kept here for consumers who extend `RouteRegistry`; the registry
   * itself doesn't emit warnings today.
   */
  protected warn(message: string): void {
    if (!this.loggerManager) return;
    try {
      this.loggerManager.create('ssr').warn(message);
    } catch {
      /* logger failure must not break registration */
    }
  }
}
