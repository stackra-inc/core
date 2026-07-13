import { describe, it, expect } from 'vitest';

import { defineRoutes, defineApiRoute } from '@/react';

describe('defineRoutes', () => {
  it('is a runtime identity', () => {
    const routes = [{ path: '/' }, { path: '/about' }];
    expect(defineRoutes(routes)).toBe(routes);
  });

  it('preserves middleware + handle fields', () => {
    const routes = defineRoutes([
      { path: '/dashboard', middleware: ['@auth'], handle: { seo: { title: 'Dashboard' } } },
    ]);
    expect(routes[0]!.middleware).toEqual(['@auth']);
    expect(routes[0]!.handle?.seo?.title).toBe('Dashboard');
  });
});

describe('defineApiRoute', () => {
  it('is a runtime identity', () => {
    const route = { path: '/api/x', method: 'GET' as const, handler: async () => ({}) };
    expect(defineApiRoute(route)).toBe(route);
  });
});
