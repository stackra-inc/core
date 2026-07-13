import { describe, it, expect, beforeEach } from 'vitest';
import 'reflect-metadata';

import { defineMiddleware, MiddlewareRegistry } from '@/core/middleware';

describe('MiddlewareRegistry', () => {
  let registry: MiddlewareRegistry;

  beforeEach(() => {
    registry = new MiddlewareRegistry();
  });

  it('registers named middleware retrievable by name', () => {
    const mw = defineMiddleware({ name: 'auth', handle: async (_c, next) => next() });
    registry.register(mw);
    expect(registry.get('auth')?.name).toBe('auth');
  });

  it('accepts anonymous middleware without a name index', () => {
    const mw = defineMiddleware(async (_c, next) => next());
    registry.register(mw);
    expect(registry.list().length).toBe(0);
  });

  it('list() returns entries in declaration order', () => {
    registry.register(defineMiddleware({ name: 'a', handle: async (_c, next) => next() }));
    registry.register(defineMiddleware({ name: 'b', handle: async (_c, next) => next() }));
    registry.register(defineMiddleware({ name: 'c', handle: async (_c, next) => next() }));
    const names = registry.list().map((m) => m.name);
    expect(names).toEqual(['a', 'b', 'c']);
  });

  it('replaces a duplicate name registration', () => {
    const first = defineMiddleware({ name: 'x', priority: 1, handle: async (_c, next) => next() });
    const second = defineMiddleware({
      name: 'x',
      priority: 99,
      handle: async (_c, next) => next(),
    });
    registry.register(first);
    registry.register(second);
    expect(registry.get('x')?.options?.priority).toBe(99);
  });

  it('registers and retrieves groups', () => {
    registry.registerGroup({ name: '@web', middleware: [] });
    expect(registry.getGroup('@web')?.name).toBe('@web');
    expect(registry.listGroups()).toHaveLength(1);
  });

  it('clear() empties both maps', () => {
    registry.register(defineMiddleware({ name: 'a', handle: async (_c, next) => next() }));
    registry.registerGroup({ name: '@web', middleware: [] });
    registry.clear();
    expect(registry.list()).toHaveLength(0);
    expect(registry.listGroups()).toHaveLength(0);
  });
});
