import { describe, it, expect } from 'vitest';
import 'reflect-metadata';

import { ApplicationFactory, Module } from '@stackra/container';
import {
  API_ROUTE_REGISTRY,
  MIDDLEWARE_REGISTRY,
  ROUTE_REGISTRY,
  SEO_SERVICE,
  SSR_RENDERER,
} from '@stackra/contracts';

import {
  SsrModule,
  defineMiddleware,
  type ApiRouteRegistry,
  type MiddlewareRegistry,
  type RouteRegistry,
  type SsrRenderer,
} from '@/core';
import type { SeoService } from '@/core/seo';
import { defineApiRoute, defineRoutes } from '@/react';

const routes = defineRoutes([
  { path: '/', handle: { seo: { title: 'Home' } } },
  { path: '/about', handle: { seo: { title: 'About' } } },
]);

const apiRoutes = [
  defineApiRoute({
    path: '/api/ping',
    method: 'GET',
    handler: async () => ({ pong: true }),
  }),
];

const logger = defineMiddleware({
  name: 'logger',
  stage: 'http' as const,
  handle: async (_ctx, next) => next(),
});

@Module({
  imports: [
    // Root: app-wide config only.
    SsrModule.forRoot({
      seo: { baseUrl: 'https://acme.test', defaults: { titleTemplate: '%s | Acme' } },
      clientEntry: '/src/main.tsx',
    }),
    // Feature: register routes / api routes / middleware.
    SsrModule.forFeature({
      routes,
      apiRoutes,
      middleware: [logger],
      groups: [{ name: '@web', middleware: ['logger'] }],
    }),
  ],
})
class AppModule {}

describe('SsrModule.forRoot', () => {
  it('populates the route registry from config', async () => {
    const app = await ApplicationFactory.create(AppModule);
    const registry = app.get(ROUTE_REGISTRY) as RouteRegistry;
    const tree = registry.getTree();
    expect(tree.map((r) => r.path)).toEqual(['/', '/about']);
  });

  it('populates the API route registry from config', async () => {
    const app = await ApplicationFactory.create(AppModule);
    const registry = app.get(API_ROUTE_REGISTRY) as ApiRouteRegistry;
    expect(registry.list().map((r) => r.path)).toContain('/api/ping');
  });

  it('registers middleware + groups', async () => {
    const app = await ApplicationFactory.create(AppModule);
    const registry = app.get(MIDDLEWARE_REGISTRY) as MiddlewareRegistry;
    expect(registry.get('logger')?.name).toBe('logger');
    expect(registry.getGroup('@web')?.name).toBe('@web');
  });

  it('exposes the renderer + SEO service', async () => {
    const app = await ApplicationFactory.create(AppModule);
    expect(app.get(SSR_RENDERER)).toBeDefined();
    expect(app.get(SEO_SERVICE)).toBeDefined();
  });

  it('renders an API route to JSON', async () => {
    const app = await ApplicationFactory.create(AppModule);
    const renderer = app.get(SSR_RENDERER) as SsrRenderer;
    const res = await renderer.render(new Request('http://localhost/api/ping'));
    expect(res.headers.get('content-type')).toContain('application/json');
    expect(await res.json()).toEqual({ pong: true });
  });

  it('returns the client shell for a human request', async () => {
    const app = await ApplicationFactory.create(AppModule);
    const renderer = app.get(SSR_RENDERER) as SsrRenderer;
    const res = await renderer.render(
      new Request('http://localhost/', {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        },
      })
    );
    const html = await res.text();
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(html).toContain('<div id="app">');
    expect(html).toContain('/src/main.tsx');
  });

  it('resolves SEO tags with the site-wide template', async () => {
    const app = await ApplicationFactory.create(AppModule);
    const seo = app.get(SEO_SERVICE) as SeoService;
    const tags = seo.collect([{ title: 'Home' }]);
    const title = tags.find((t) => t.tag === 'title');
    expect(title?.text).toBe('Home | Acme');
  });
});
