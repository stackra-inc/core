import { describe, it, expect, beforeEach } from 'vitest';
import 'reflect-metadata';

import {
  defineMiddleware,
  MiddlewareRegistry,
  MiddlewareResolver,
  MiddlewareResolutionError,
} from '@/core/middleware';
import { createMockContainer } from '@/testing';

describe('MiddlewareResolver', () => {
  let registry: MiddlewareRegistry;
  let resolver: MiddlewareResolver;

  beforeEach(() => {
    registry = new MiddlewareRegistry();
    const container = createMockContainer();
    resolver = new MiddlewareResolver(registry, container);
  });

  it('orders by priority descending', () => {
    const low = defineMiddleware({
      name: 'low',
      priority: 1,
      stage: 'http' as const,
      handle: async (_c, next) => next(),
    });
    const high = defineMiddleware({
      name: 'high',
      priority: 10,
      stage: 'http' as const,
      handle: async (_c, next) => next(),
    });
    const chain = resolver.resolve({
      global: [low, high],
      environment: 'server',
      stage: 'http',
    });
    expect(chain.map((m) => m.name)).toEqual(['high', 'low']);
  });

  it('breaks priority ties by declaration order', () => {
    const a = defineMiddleware({
      name: 'a',
      priority: 5,
      stage: 'http' as const,
      handle: async (_c, next) => next(),
    });
    const b = defineMiddleware({
      name: 'b',
      priority: 5,
      stage: 'http' as const,
      handle: async (_c, next) => next(),
    });
    const chain = resolver.resolve({
      global: [a, b],
      environment: 'server',
      stage: 'http',
    });
    expect(chain.map((m) => m.name)).toEqual(['a', 'b']);
  });

  it('honors dependsOn as a partial order', () => {
    const auth = defineMiddleware({
      name: 'auth',
      stage: 'http' as const,
      handle: async (_c, next) => next(),
    });
    const guard = defineMiddleware({
      name: 'guard',
      stage: 'http' as const,
      dependsOn: ['auth'],
      handle: async (_c, next) => next(),
    });
    // Register in reverse so the DAG has real work to do.
    const chain = resolver.resolve({
      global: [guard, auth],
      environment: 'server',
      stage: 'http',
    });
    const authIdx = chain.findIndex((m) => m.name === 'auth');
    const guardIdx = chain.findIndex((m) => m.name === 'guard');
    expect(authIdx).toBeGreaterThanOrEqual(0);
    expect(guardIdx).toBeGreaterThan(authIdx);
  });

  it('throws MIDDLEWARE_CYCLE_DETECTED for circular dependsOn', () => {
    const a = defineMiddleware({
      name: 'a',
      stage: 'http' as const,
      dependsOn: ['b'],
      handle: async (_c, next) => next(),
    });
    const b = defineMiddleware({
      name: 'b',
      stage: 'http' as const,
      dependsOn: ['a'],
      handle: async (_c, next) => next(),
    });
    expect(() =>
      resolver.resolve({
        global: [a, b],
        environment: 'server',
        stage: 'http',
      })
    ).toThrow(MiddlewareResolutionError);
  });

  it('throws MIDDLEWARE_UNKNOWN_REFERENCE for unknown string refs', () => {
    expect(() =>
      resolver.resolve({
        global: ['ghost'],
        environment: 'server',
        stage: 'http',
      })
    ).toThrow(MiddlewareResolutionError);
  });

  it('filters out server-only middleware when environment is client', () => {
    const serverOnly = defineMiddleware({
      name: 'server-only',
      runOn: 'server' as const,
      stage: 'ui' as const,
      handle: async (_c, next) => next(),
    });
    const clientMw = defineMiddleware({
      name: 'client',
      runOn: 'client' as const,
      stage: 'ui' as const,
      handle: async (_c, next) => next(),
    });
    const chain = resolver.resolve({
      global: [serverOnly, clientMw],
      environment: 'client',
      stage: 'ui',
    });
    expect(chain.map((m) => m.name)).toEqual(['client']);
  });

  it('filters out middleware whose enabled predicate returns false', () => {
    const disabled = defineMiddleware({
      name: 'disabled',
      enabled: false,
      stage: 'http' as const,
      handle: async (_c, next) => next(),
    });
    const enabled = defineMiddleware({
      name: 'enabled',
      enabled: true,
      stage: 'http' as const,
      handle: async (_c, next) => next(),
    });
    const chain = resolver.resolve({
      global: [disabled, enabled],
      environment: 'server',
      stage: 'http',
    });
    expect(chain.map((m) => m.name)).toEqual(['enabled']);
  });

  it('throws MIDDLEWARE_ENABLED_THREW when the predicate throws', () => {
    const bad = defineMiddleware({
      name: 'bad',
      enabled: () => {
        throw new Error('boom');
      },
      stage: 'http' as const,
      handle: async (_c, next) => next(),
    });
    expect(() =>
      resolver.resolve({
        global: [bad],
        environment: 'server',
        stage: 'http',
      })
    ).toThrow(MiddlewareResolutionError);
  });

  it('expands group references', () => {
    const guard = defineMiddleware({
      name: 'guard',
      stage: 'http' as const,
      handle: async (_c, next) => next(),
    });
    registry.register(guard);
    registry.registerGroup({ name: '@web', middleware: [guard] });
    const chain = resolver.resolve({
      groups: ['@web'],
      environment: 'server',
      stage: 'http',
    });
    expect(chain.map((m) => m.name)).toEqual(['guard']);
  });

  it('throws when a referenced group does not exist', () => {
    expect(() =>
      resolver.resolve({
        groups: ['@ghost'],
        environment: 'server',
        stage: 'http',
      })
    ).toThrow(MiddlewareResolutionError);
  });
});
