# @stackra/ssr

Server-side rendering, routing, and middleware for the Stackra framework. Client-first (React Router v7 library mode), SSR for SEO only (crawler detection + streaming), zero file-based routing.

Ships as a set of subpath entries — import exactly what you need:

| Subpath        | Content                                                                |
| -------------- | ---------------------------------------------------------------------- |
| `.`            | Root barrel — re-exports the middleware surface for convenience        |
| `./middleware` | `defineMiddleware`, signals, `MiddlewareModule`, registry, resolver    |
| `./server`     | (Coming) SSR renderer, streaming, HTTP adapters                        |
| `./react`      | (Coming) React bindings — hooks, `<Meta>`, `<Link>`, `<StackraRouter>` |
| `./vite`       | (Coming) Vite plugin + virtual modules                                 |
| `./testing`    | `createMockContext`, `runMiddleware`, `createMockContainer`            |

## Install

```bash
pnpm add @stackra/ssr @stackra/container @stackra/contracts @stackra/pipeline reflect-metadata
```

Optional peers: `@stackra/events`, `@stackra/logger`, `react`, `react-dom`, `react-router-dom`.

## Middleware — `defineMiddleware`

The `defineMiddleware` primitive is a typed identity function with three overloads. It preserves generics without widening and enables the type-level state chaining that flows through the entire chain.

### Function form

Simplest form — a bare handler.

```typescript
import { defineMiddleware } from '@stackra/ssr/middleware';

const logRequests = defineMiddleware<HttpContext>(async (ctx, next) => {
  console.log(`[${ctx.request.method}] ${ctx.url.pathname}`);
  return next();
});
```

### Options form

Full metadata payload plus an inline handler.

```typescript
const requireAuth = defineMiddleware({
  name: 'auth.require',
  description: 'Reject unauthenticated requests',
  priority: 100,
  runOn: 'both',
  stage: 'http',
  handle: async (ctx, next) => {
    if (!ctx.request.headers.get('authorization')) {
      redirect('/login', 302);
    }
    return next();
  },
});
```

### Class form

Container-resolved class with a `handle` method. Metadata is attached via a second argument.

```typescript
import { Injectable } from '@stackra/container';

@Injectable()
class RateLimitMiddleware {
  async handle(ctx: HttpContext, next: MiddlewareNext<Response>, limit: number, window: string) {
    // ...
    return next();
  }
}

export const rateLimit = defineMiddleware(RateLimitMiddleware, {
  name: 'rate-limit',
  priority: 50,
  stage: 'http',
});
```

## Signals — control-flow helpers

Throw a signal from anywhere in a middleware to short-circuit the chain. Signals are caught at the outer pipeline boundary and mapped to the appropriate stage-specific outcome.

```typescript
import { redirect, notFound, abort } from '@stackra/ssr/middleware';

const authGate = defineMiddleware(async (ctx, next) => {
  const user = await ctx.container.get(AuthService).currentUser();
  if (!user) redirect('/login', 302);
  if (user.banned) notFound('User not found');
  return next();
});

const featureFlag = defineMiddleware(async (ctx, next) => {
  if (!flags.enabled('new-checkout')) abort(new Response('Feature disabled', { status: 503 }));
  return next();
});
```

| Helper          | Throws           | Status                |
| --------------- | ---------------- | --------------------- |
| `redirect(url)` | `RedirectSignal` | 302 default (300–308) |
| `notFound()`    | `NotFoundSignal` | 404                   |
| `abort(result)` | `AbortSignal`    | terminates chain      |

## Module — `MiddlewareModule.forRoot`

Import once at the root, provide middleware and groups.

```typescript
import { Module } from '@stackra/container';
import { MiddlewareModule, defineMiddlewareGroup } from '@stackra/ssr/middleware';

const webGroup = defineMiddlewareGroup({
  name: '@web',
  middleware: [sessionLoader, csrfProtection, flashMessages],
});

@Module({
  imports: [
    MiddlewareModule.forRoot({
      middleware: [logRequests, requireAuth, rateLimit],
      groups: [webGroup],
    }),
  ],
})
export class AppModule {}
```

Feature modules extend the registry via `.forFeature(...)`:

```typescript
@Module({
  imports: [MiddlewareModule.forFeature({ middleware: [csrfProtection] })],
})
class AuthFeatureModule {}
```

## Per-route usage

Attach middleware to a specific route. Groups and named references are resolved through the registry.

```typescript
const routes = defineRoutes([
  {
    path: '/dashboard',
    middleware: ['@web', requireAuth, [rateLimit, 100, '1m']],
    component: DashboardPage,
  },
]);
```

## State chaining

Middleware can promise to write specific state keys via `stateAdditions`. Downstream middleware sees a fully-typed intersection of every upstream promise.

```typescript
interface UserAttached {
  user: User;
}

const attachUser = defineMiddleware<HttpContext, void, UserAttached>({
  name: 'attach-user',
  stateAdditions: ['user'],
  handle: async (ctx, next) => {
    const user = await ctx.container.get(AuthService).currentUser();
    (ctx.state as UserAttached).user = user;
    return next();
  },
});

// Downstream middleware sees `ctx.state.user: User` typed correctly
const dashboardHandler = defineMiddleware<HttpContext & { state: UserAttached }>(
  async (ctx, next) => {
    console.log(`Hello, ${ctx.state.user.name}`);
    return next();
  }
);
```

## Testing — `createMockContext`

```typescript
import { createMockContext } from '@stackra/ssr/testing';
import { describe, it, expect } from 'vitest';

describe('requireAuth', () => {
  it('redirects unauthenticated requests', async () => {
    const ctx = createMockContext('http', {
      request: new Request('http://localhost/dashboard'),
    });
    await expect(ctx.runMiddleware(requireAuth)).rejects.toMatchObject({
      kind: 'redirect',
      url: '/login',
      status: 302,
    });
  });

  it('passes through authenticated requests', async () => {
    const next = vi.fn().mockResolvedValue(new Response('OK'));
    const ctx = createMockContext('http', {
      request: new Request('http://localhost/dashboard', {
        headers: { authorization: 'Bearer xxx' },
      }),
    });
    const result = await ctx.runMiddleware(requireAuth, next);
    expect(next).toHaveBeenCalledOnce();
    expect(result).toBeInstanceOf(Response);
  });
});
```

## Pipeline interop

Every `MiddlewareDefinition` can be adapted to a `PipeType` via `toPipe(mw, container)` and dropped straight into a `@stackra/pipeline` `Pipeline.through([...])`.

```typescript
import { Pipeline } from '@stackra/pipeline';
import { toPipe } from '@stackra/ssr/middleware';

const pipes = [requireAuth, rateLimit].map((mw) => toPipe(mw, container));

const result = await new Pipeline(container)
  .send(request)
  .through(pipes)
  .then((req) => handleRequest(req));
```

## Configuration

```bash
cp node_modules/@stackra/ssr/config/middleware.config.ts src/config/middleware.config.ts
```

Then import into `AppModule`:

```typescript
import { middlewareConfig } from '@/config/middleware.config';

@Module({
  imports: [MiddlewareModule.forRoot(middlewareConfig)],
})
export class AppModule {}
```

## License

MIT © Stackra L.L.C
