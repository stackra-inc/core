/**
 * @file mock-container.ts
 * @module @stackra/ssr/testing
 * @description Lightweight `IApplication`-compatible mock for middleware tests.
 *
 *   Provides `.get(token)`, `.provide(token, value)`, and exposes the
 *   underlying `Map` for assertions. Not a full container substitute —
 *   intended for isolated middleware unit tests where a real
 *   `ApplicationContext` would be overkill.
 *
 *   Every method call is recorded via `createAssertableProxy` from
 *   `@stackra/testing`, so tests can assert on interactions:
 *
 *   ```ts
 *   const container = createMockContainer();
 *   container.provide(TOKEN, service);
 *   container.get(TOKEN);
 *   expect(container.$.wasCalledWith('get', TOKEN)).toBe(true);
 *   ```
 */

import type { IApplication, InjectionToken } from '@stackra/contracts';
import { createAssertableProxy, type AssertableProxy } from '@stackra/testing';

/**
 * Public surface of the mock container — extends `IApplication` with
 * test-only helpers.
 */
export interface IMockContainer extends IApplication {
  /** Register a value under a token. */
  provide<T>(token: InjectionToken<T>, value: T): void;
  /** Direct access to the underlying token → value map. */
  readonly registry: Map<InjectionToken, unknown>;
  /** Resolve asynchronously (parity with `ApplicationContext.resolve`). */
  resolve<T>(token: InjectionToken<T>): Promise<T>;
  /** Whether a token is registered. */
  has(token: InjectionToken): boolean;
  /** Clear the registry (parity with `ApplicationContext.close`). */
  close(): Promise<void>;
}

/**
 * Assertable mock container — same surface as `IMockContainer` plus the
 * `$` accessor from `@stackra/testing` for call assertions.
 */
export type MockContainer = AssertableProxy<IMockContainer>;

/**
 * Underlying (non-proxied) implementation. Kept as a named class so tests
 * that need the concrete type can import it, though 99% of consumers use
 * `createMockContainer()` and never reach for this directly.
 */
class MockContainerImpl implements IMockContainer {
  public readonly registry: Map<InjectionToken, unknown> = new Map();

  public provide<T>(token: InjectionToken<T>, value: T): void {
    this.registry.set(token as InjectionToken, value);
  }

  public get<T>(token: InjectionToken<T>): T {
    if (!this.registry.has(token as InjectionToken)) {
      throw new Error(
        `MockContainer: no provider registered for token "${String(token)}". ` +
          'Call .provide(token, value) before requesting it.'
      );
    }
    return this.registry.get(token as InjectionToken) as T;
  }

  public resolve<T>(token: InjectionToken<T>): Promise<T> {
    return Promise.resolve(this.get(token));
  }

  public has(token: InjectionToken): boolean {
    return this.registry.has(token as InjectionToken);
  }

  public close(): Promise<void> {
    this.registry.clear();
    return Promise.resolve();
  }
}

/**
 * Create a fresh mock container wrapped in an assertable proxy.
 *
 * Every method call (`get`, `provide`, `resolve`, `has`, `close`) is
 * recorded on the attached `Assertable`, accessible via `container.$`.
 *
 * @example
 * ```ts
 * const container = createMockContainer();
 * container.provide(TOKEN, myService);
 * container.get(TOKEN);
 * expect(container.$.wasCalledWith('get', TOKEN)).toBe(true);
 * expect(container.$.callCount('provide')).toBe(1);
 * ```
 */
export function createMockContainer(): MockContainer {
  return createAssertableProxy(new MockContainerImpl());
}

export { MockContainerImpl };
