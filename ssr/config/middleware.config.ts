/**
 * @file middleware.config.ts
 * @module @stackra/ssr/config
 * @description Application-level middleware configuration.
 *   Consumed by `MiddlewareModule.forRoot()` at bootstrap.
 */

import { defineConfig, defineMiddlewareGroup } from '@stackra/ssr/middleware';

/*
|--------------------------------------------------------------------------
| Middleware Groups
|--------------------------------------------------------------------------
|
| Groups bundle related middleware under a single name (must start with `@`).
| Routes and other groups reference bundles by name — e.g. `middleware: ['@web']`.
| Reserved built-in group names: `@web`, `@api`, `@guest`, `@auth`.
|
*/
export const webGroup = defineMiddlewareGroup({
  name: '@web',
  description: 'Standard browser request pipeline — session, CSRF, flash.',
  middleware: [
    // Example: sessionLoader, csrfProtection, flashMessages
  ],
});

export const apiGroup = defineMiddlewareGroup({
  name: '@api',
  description: 'JSON API pipeline — content-type, rate limiting, auth.',
  middleware: [
    // Example: enforceJson, rateLimit, tokenAuth
  ],
});

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Middleware listed here runs on every request, before any route-attached
| middleware. Order matters — the array is sorted by declared `priority`
| (higher first) with ties broken by declaration order.
|
*/
export const middlewareConfig = defineConfig({
  middleware: [
    // Example:
    // defineMiddleware({
    //   name: 'logger',
    //   priority: 100,
    //   handle: async (ctx, next) => {
    //     console.log(`[${ctx.request.method}] ${ctx.url.pathname}`);
    //     return next();
    //   },
    // }),
  ],
  groups: [webGroup, apiGroup],
});
