import { describe, it, expect } from 'vitest';

import { matchApiRoute } from '@/core/server';
import type { StackraApiRoute } from '@/react';

const routes: StackraApiRoute[] = [
  { path: '/api/users', method: 'GET', handler: async () => ({}) },
  { path: '/api/users/:id', method: 'GET', handler: async () => ({}) },
  { path: '/api/users/:id', method: 'DELETE', handler: async () => ({}) },
  { path: '/api/posts', method: 'POST', handler: async () => ({}) },
];

describe('matchApiRoute', () => {
  it('matches a static path + method', () => {
    const match = matchApiRoute(routes, new Request('http://localhost/api/users'));
    expect(match?.route.path).toBe('/api/users');
    expect(match?.params).toEqual({});
  });

  it('extracts path params', () => {
    const match = matchApiRoute(routes, new Request('http://localhost/api/users/42'));
    expect(match?.route.path).toBe('/api/users/:id');
    expect(match?.params).toEqual({ id: '42' });
  });

  it('discriminates on method', () => {
    const del = matchApiRoute(
      routes,
      new Request('http://localhost/api/users/42', { method: 'DELETE' })
    );
    expect(del?.route.method).toBe('DELETE');
  });

  it('returns null on no match', () => {
    expect(matchApiRoute(routes, new Request('http://localhost/api/unknown'))).toBeNull();
    expect(matchApiRoute(routes, new Request('http://localhost/api/posts'))).toBeNull(); // GET vs POST
  });

  it('decodes URL-encoded params', () => {
    const match = matchApiRoute(routes, new Request('http://localhost/api/users/john%40acme.com'));
    expect(match?.params.id).toBe('john@acme.com');
  });
});
