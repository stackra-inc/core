/**
 * @file middleware-registry.service.ts
 * @module @stackra/ssr/middleware/services
 * @description The runtime middleware / group registry.
 *
 *   Holds all middleware and groups registered via `MiddlewareModule.forRoot(...)`
 *   or `.forFeature(...)`. Consumers resolve the registry through the
 *   `MIDDLEWARE_REGISTRY` DI token (declared in `@stackra/contracts`).
 */

import { Injectable, Inject, Optional } from '@stackra/container';
import { LOGGER_MANAGER } from '@stackra/contracts';
import type { ILoggerManager } from '@stackra/contracts';

import type { MiddlewareGroup } from '../interfaces/middleware-group.interface';
import type { MiddlewareOptions } from '../interfaces/middleware-options.interface';
import type { MiddlewareDefinition } from '../types/middleware-definition.type';
import { MIDDLEWARE_METADATA_KEY } from '../constants/metadata-keys.constant';

/**
 * Descriptor stored per named middleware entry.
 */
export interface RegisteredMiddleware {
  readonly name: string;
  readonly definition: MiddlewareDefinition;
  readonly options: MiddlewareOptions | undefined;
  readonly declarationIndex: number;
}

/**
 * Middleware registry service.
 *
 * Populated eagerly at container init by `MiddlewareModule`. Duplicate
 * name registrations replace the earlier entry and emit a warning via
 * the optional logger.
 */
@Injectable()
export class MiddlewareRegistry {
  private readonly middleware: Map<string, RegisteredMiddleware> = new Map();
  private readonly groups: Map<string, MiddlewareGroup> = new Map();
  private counter = 0;

  public constructor(
    @Optional() @Inject(LOGGER_MANAGER) private readonly loggerManager?: ILoggerManager
  ) {}

  /**
   * Register a single middleware. Named entries are indexed and become
   * referenceable by string. Anonymous entries are still stored for
   * ordering but cannot be retrieved by name.
   */
  public register(def: MiddlewareDefinition): void {
    const options = this.extractOptions(def);
    const name = options?.name ?? '';
    if (name) {
      if (this.middleware.has(name)) {
        this.warn(
          `Duplicate middleware name "${name}" — the earlier registration is being replaced.`
        );
      }
      this.middleware.set(name, {
        name,
        definition: def,
        options,
        declarationIndex: this.counter++,
      });
    }
  }

  /**
   * Register a middleware group by its `name` (must start with `@`).
   */
  public registerGroup(group: MiddlewareGroup): void {
    if (this.groups.has(group.name)) {
      this.warn(
        `Duplicate group name "${group.name}" — the earlier registration is being replaced.`
      );
    }
    this.groups.set(group.name, group);
  }

  /**
   * Emit a warning via the optional logger. Fail-soft when logger is absent.
   */
  private warn(message: string): void {
    if (!this.loggerManager) return;
    try {
      this.loggerManager.create('middleware').warn(message);
    } catch {
      // Never let a logger failure break registration.
    }
  }

  /**
   * Look up a middleware by name. Returns `undefined` for unknown names.
   */
  public get(name: string): RegisteredMiddleware | undefined {
    return this.middleware.get(name);
  }

  /**
   * Look up a group by name.
   */
  public getGroup(name: string): MiddlewareGroup | undefined {
    return this.groups.get(name);
  }

  /**
   * Enumerate every registered middleware in declaration order.
   */
  public list(): readonly RegisteredMiddleware[] {
    return [...this.middleware.values()];
  }

  /**
   * Enumerate every registered group.
   */
  public listGroups(): readonly MiddlewareGroup[] {
    return [...this.groups.values()];
  }

  /**
   * Reset the registry. Test-only escape hatch — production code should
   * treat the registry as append-only within a container lifetime.
   */
  public clear(): void {
    this.middleware.clear();
    this.groups.clear();
    this.counter = 0;
  }

  /**
   * Extract the options blob from any middleware form. Function-form
   * returns `undefined`. Class-form reads reflect-metadata.
   */
  private extractOptions(def: MiddlewareDefinition): MiddlewareOptions | undefined {
    if (typeof def === 'function') {
      // Class form — read reflect metadata (empty object if absent).
      const meta = Reflect.getMetadata?.(MIDDLEWARE_METADATA_KEY, def) as
        MiddlewareOptions | undefined;
      return meta;
    }
    if (typeof def === 'object' && def !== null) {
      return def as MiddlewareOptions;
    }
    return undefined;
  }
}
