/**
 * @file to-pipe.util.ts
 * @module @stackra/ssr/middleware/utils
 * @description Adapts a `MiddlewareDefinition` to a `PipeType` accepted by
 *   `@stackra/pipeline`.
 *
 *   Every middleware form (function / options-with-handle /
 *   options-with-resolve / class) is normalised to a `PipeClosure` shape
 *   `(passable, next) => result`. Class resolution and options normalisation
 *   happen lazily inside the closure so that construction is deferred to
 *   the moment the pipeline actually runs.
 */

import type { IApplication } from '@stackra/contracts';
import type { PipeType } from '@stackra/pipeline';

import { MiddlewareExecutionError } from '../errors/middleware-execution.error';
import type {
  MiddlewareClassRef,
  MiddlewareOptions,
} from '../interfaces/middleware-options.interface';
import type { MiddlewareDefinition } from '../types/middleware-definition.type';
import type { MiddlewareHandler } from '../types/middleware-handler.type';
import { isClass } from './is-class.util';
import { wrapNext } from './wrap-next.util';

/**
 * Adapt a middleware definition to a pipeline pipe.
 *
 * @param middleware - Function, options, or class-form middleware
 * @param container  - DI container used to resolve class-form middleware
 * @param name       - Optional resolved name — surfaced in error metadata
 */
export function toPipe(
  middleware: MiddlewareDefinition,
  container: IApplication,
  name: string = ''
): PipeType {
  // Options form ---------------------------------------------------------
  if (isOptions(middleware)) {
    if (middleware.handle) {
      const handler = middleware.handle;
      const displayName = middleware.name ?? name;
      return async (passable: unknown, next: (p: unknown) => unknown) => {
        return await handler(passable as object, wrapNext(next, passable, displayName));
      };
    }
    if (middleware.resolve) {
      return classToPipe(middleware.resolve, container, middleware.name ?? name);
    }
    throw new MiddlewareExecutionError(
      `Middleware "${middleware.name ?? '<anonymous>'}" has neither handle nor resolve.`,
      'MIDDLEWARE_HANDLER_THREW',
      { middlewareName: middleware.name ?? name }
    );
  }

  // Class form -----------------------------------------------------------
  if (typeof middleware === 'function' && isClass(middleware)) {
    return classToPipe(middleware as MiddlewareClassRef, container, name);
  }

  // Function form --------------------------------------------------------
  if (typeof middleware === 'function') {
    const handler = middleware as MiddlewareHandler;
    return async (passable: unknown, next: (p: unknown) => unknown) => {
      return await handler(passable as object, wrapNext(next, passable, name));
    };
  }

  throw new MiddlewareExecutionError(
    `Unsupported middleware form: ${typeof middleware}.`,
    'MIDDLEWARE_HANDLER_THREW',
    { middlewareName: name }
  );
}

/**
 * Type guard — detect the options form via presence of any distinguishing
 * option field. Plain functions have no enumerable keys of these names.
 */
function isOptions(value: unknown): value is MiddlewareOptions {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('handle' in value || 'resolve' in value || 'name' in value)
  );
}

/**
 * Adapt a class-form middleware to a pipe by lazily resolving the class
 * from the container.
 */
function classToPipe(cls: MiddlewareClassRef, container: IApplication, name: string): PipeType {
  return async (passable: unknown, next: (p: unknown) => unknown) => {
    let instance: { handle: MiddlewareHandler };
    try {
      instance = container.get(cls) as { handle: MiddlewareHandler };
    } catch (error) {
      throw new MiddlewareExecutionError(
        `Failed to resolve middleware class "${cls.name || name}" from the container.`,
        'MIDDLEWARE_RESOLUTION_FAILED',
        { middlewareName: name || cls.name },
        error
      );
    }
    if (!instance || typeof instance.handle !== 'function') {
      throw new MiddlewareExecutionError(
        `Middleware class "${cls.name || name}" does not expose a handle() method.`,
        'MIDDLEWARE_RESOLUTION_FAILED',
        { middlewareName: name || cls.name }
      );
    }
    return await instance.handle(passable as object, wrapNext(next, passable, name || cls.name));
  };
}
