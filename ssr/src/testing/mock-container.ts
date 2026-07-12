/**
 * @file mock-container.ts
 * @module @stackra/ssr/testing
 * @description Lightweight `IApplication`-compatible mock for middleware tests.
 *
 *   Provides `.get(token)`, `.provide(token, value)`, and exposes the
 *   underlying `Map` for assertions. Not a full container substitute —
 *   intended for isolated middleware unit tests where a real
 *   `ApplicationContext` would be overkill.
 */

import type { IApplication, InjectionToken } from '@stackra/contracts';

/**
 * `IApplication`-compatible mock backed by a `Map`.
 */
export interface MockContainer extends IApplication {
  /** Register a value under a token. */
  provide<T>(token: InjectionToken<T>, value: T): void;
  /** Direct access to the underlying token → value map. */
  readonly registry: Map<InjectionToken, unknown>;
}

/**
 * Create a fresh mock container.
 */
export function createMockContainer(): MockContainer {
  const registry = new Map<InjectionToken, unknown>();

  const get = <T>(token: InjectionToken<T>): T => {
    if (!registry.has(token as InjectionToken)) {
      throw new Error(
        `MockContainer: no provider registered for token "${String(token)}". ` +
          'Call .provide(token, value) before requesting it.'
      );
    }
    return registry.get(token as InjectionToken) as T;
  };

  const mock = {
    registry,
    provide<T>(token: InjectionToken<T>, value: T): void {
      registry.set(token as InjectionToken, value);
    },
    get,
    // Extra IApplication surface stubs — sufficient for middleware tests.
    resolve<T>(token: InjectionToken<T>): Promise<T> {
      return Promise.resolve(get(token));
    },
    has(token: InjectionToken): boolean {
      return registry.has(token as InjectionToken);
    },
    close(): Promise<void> {
      registry.clear();
      return Promise.resolve();
    },
  } as unknown as MockContainer;

  return mock;
}
