# Design Document

## Package Placement Decision (Supersedes Requirement 17)

Requirement 17 in `requirements.md` was written when the middleware primitive
was scoped as its own package `@stackra/middleware`. The final structure — as
agreed with the user — merges the primitive into `@stackra/ssr` alongside the
HTTP server layer and the React SSR renderer. `@stackra/pipeline` remains a
separate, generic runtime.

**Final package placement:**

| Symbol                             | Location                          |
| ---------------------------------- | --------------------------------- |
| Pipeline runtime engine            | `@stackra/pipeline`               |
| `defineMiddleware`, signals, types | `@stackra/ssr/middleware` subpath |
| HTTP request/response, adapters    | `@stackra/ssr/server` subpath     |
| React SSR renderer, streaming      | `@stackra/ssr/server` subpath     |
| React client runtime + hooks       | `@stackra/ssr` root (client)      |
| Vite plugin + virtual modules      | `@stackra/ssr/vite` subpath       |
| React ergonomics wrappers          | `@stackra/ssr/react` subpath      |
| Test helpers                       | `@stackra/ssr/testing` subpath    |

Every acceptance criterion referring to `@stackra/middleware`, `@stackra/server`,
or their separate publishing lifecycles is rebound onto the equivalent
subpath of `@stackra/ssr` for the purpose of this design and its tasks.

## Overview

`defineMiddleware` is the canonical, type-safe primitive for authoring middleware
in the Stackra platform. It follows the same identity-style pattern as
`defineConfig`, `defineRoutes`, and `defineApiRoutes` — the returned value is
reference-equal to the input, but the type inference and metadata attachment
make it a first-class building block for the router, the HTTP server, and any
`@stackra/pipeline` chain.

The primitive is intentionally thin. All execution logic lives in
`@stackra/pipeline` (Laravel-style `Pipeline` with reduce-right composition).
`defineMiddleware` and its supporting types are responsible for:

- Type inference — state chaining, context by stage, parameterized tuples.
- Metadata carriage — `name`, `priority`, `runOn`, `dependsOn`, `enabled`.
- Signal semantics — `redirect`, `notFound`, `abort` throwables.
- Registry introspection — a resolver that produces stable, ordered chains.
- Test ergonomics — `createMockContext` + `runMiddleware`.

The runtime engine is unchanged. `MiddlewareDefinition` values compile to
`PipeType` via a small adapter and flow through the existing pipeline machinery.

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     App Author's Code                            │
│                                                                  │
│  defineMiddleware({ name, handle, priority, runOn, ... })        │
│  defineRoutes([...])         defineApiRoutes([...])              │
│  redirect(url)  notFound()   abort(result)                       │
└─────────────────────────────┬────────────────────────────────────┘
                              │  MiddlewareDefinition[]
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                @stackra/ssr/middleware (this spec)               │
│                                                                  │
│  • defineMiddleware, defineMiddlewareGroup                       │
│  • MiddlewareDefinition, HttpContext, UiContext, PipeContext     │
│  • MiddlewareRegistry, MiddlewareResolver                        │
│  • toPipe adapter                                                │
│  • redirect / notFound / abort signal classes                    │
│  • MiddlewareModule (forRoot / forFeature)                       │
└─────────────────────────────┬────────────────────────────────────┘
                              │  Pipe[]
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                       @stackra/pipeline                          │
│                                                                  │
│  • Pipeline: send / through / then / thenReturn / finally        │
│  • PipelineHub: named preset registry                            │
│  • PipeType: closure | string | object | tuple                   │
└─────────────────────────────┬────────────────────────────────────┘
                              │  invocation
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
    @stackra/ssr/server    @stackra/ssr    @stackra/ssr/vite
        (HTTP stage)      (client stage)   (dev / build)
```

Every consumer surface (`defineApiRoutes`, `defineRoutes`, `PipelineHub.pipeline`)
takes `MiddlewareDefinition` values, hands them to the resolver, and receives
`PipeType[]` ready to be dropped into a `Pipeline.through(pipes)` call.

## Type Surface

### `MiddlewareDefinition`

Third-generic parameter carries the state contribution so downstream middleware
can observe it via intersection at composition time. Fourth generic carries
the tuple parameter shape.

```typescript
export type MiddlewareDefinition<
  TContext extends MiddlewareContextBase = MiddlewareContextBase,
  TResult = unknown,
  TStateAdditions extends object = {},
  TParams extends unknown[] = [],
> =
  | MiddlewareHandler<TContext, TResult, TParams>
  | MiddlewareOptions<TContext, TResult, TStateAdditions, TParams>
  | MiddlewareClassRef<TContext, TResult, TStateAdditions, TParams>;

export interface MiddlewareOptions<
  TContext extends MiddlewareContextBase,
  TResult,
  TStateAdditions extends object,
  TParams extends unknown[],
> {
  /** Stable name — required to be addressable by string. Optional; anonymous middleware is allowed. */
  readonly name?: string;

  /** Execution stage. Determines the context type. */
  readonly stage?: 'http' | 'ui' | 'pipe';

  /** Environment restriction. Default 'both'. */
  readonly runOn?: 'server' | 'client' | 'both';

  /** Static ordering weight. Descending. Default 0. */
  readonly priority?: number;

  /** Named middleware that must run BEFORE this one. */
  readonly dependsOn?: readonly (string | MiddlewareRef)[];

  /** Named middleware this middleware must run before. */
  readonly runsBefore?: readonly (string | MiddlewareRef)[];

  /** Named middleware this middleware must run after. */
  readonly runsAfter?: readonly (string | MiddlewareRef)[];

  /** Feature flag. Boolean or resolver function. Default true. */
  readonly enabled?: boolean | ((container: IApplication) => boolean);

  /** Middleware handler — function form. Mutually exclusive with `resolve`. */
  readonly handle?: MiddlewareHandler<TContext, TResult, TParams>;

  /** DI-resolved class reference — resolved at execution. Mutually exclusive with `handle`. */
  readonly resolve?: Type<{ handle: MiddlewareHandler<TContext, TResult, TParams> }>;

  /** Compile-time state contribution — never populated at runtime. */
  readonly __stateAdditions?: TStateAdditions;

  /** Compile-time params contribution — never populated at runtime. */
  readonly __params?: TParams;
}

export type MiddlewareHandler<
  TContext extends MiddlewareContextBase,
  TResult,
  TParams extends unknown[] = [],
> = (
  ctx: TContext,
  next: MiddlewareNext<TResult>,
  ...params: TParams
) => TResult | Promise<TResult>;

export type MiddlewareNext<TResult> = <TCtxOverride extends MiddlewareContextBase = never>(
  ctx?: TCtxOverride
) => Promise<TResult>;
```

### Context Types

Three stage-specific context shapes. All extend `MiddlewareContextBase` which
carries the DI container and mutable `state`.

```typescript
export interface MiddlewareContextBase<TState extends object = {}> {
  readonly container: IApplication;
  readonly state: TState;
}

export interface HttpContext<TState extends object = {}> extends MiddlewareContextBase<TState> {
  readonly request: IHttpRequest;
  readonly response: IHttpResponse;
  readonly params: Readonly<Record<string, string>>;
  readonly url: URL;
}

export interface UiContext<TState extends object = {}> extends MiddlewareContextBase<TState> {
  readonly location: Location; // Location from history — url, pathname, search, hash
  readonly matches: readonly RouteMatch[]; // Matched route branch (root → leaf)
  readonly params: Readonly<Record<string, string>>;
  readonly signal: AbortSignal; // Cancellation for in-flight navigation
}

export interface PipeContext<
  TPassable = unknown,
  TState extends object = {},
> extends MiddlewareContextBase<TState> {
  readonly passable: TPassable;
}
```

The `state` object is deliberately mutable. Middleware writes to `state` and
subsequent middleware reads it. The alternative — force every mutation through
`next({ ...ctx, state: { ...ctx.state, x } })` — is more explicit but
significantly more verbose in practice. Type-level state chaining is achieved
via `TStateAdditions` on the definition, not by observing runtime mutations.

### State Chain via Composition

`composeMiddleware<A, B, C>(a, b, c)` returns a `MiddlewareDefinition` whose
state addition is the intersection of every input's `TStateAdditions`. When
downstream middleware references `ctx.state.user`, the compiler resolves it
against the accumulated state from upstream declarations.

```typescript
type ComposeMiddleware<Chain extends readonly MiddlewareDefinition[]> = Chain extends readonly [
  infer Head,
  ...infer Rest,
]
  ? Head extends MiddlewareDefinition<any, any, infer S1, any>
    ? Rest extends readonly MiddlewareDefinition[]
      ? Rest extends readonly []
        ? S1
        : ComposeMiddleware<Rest> & S1
      : never
    : never
  : {};
```

App authors don't invoke `composeMiddleware` directly for state inference —
route definitions do. `defineRoutes` receives an array of middleware and
computes the accumulated state type internally, exposing it as the loader
context's `state` type parameter.

### Route-Level Integration

```typescript
// From defineRoutes — the route's loader sees the accumulated state
interface IRouteDefinition<TMiddleware extends readonly MiddlewareDefinition[]> {
  path: string;
  middleware?: TMiddleware;
  loader?: LoaderFn<UiContext<ComposeMiddleware<TMiddleware>>>;
  Component?: ComponentType;
  ErrorBoundary?: ComponentType<{ error: unknown }>;
  Pending?: ComponentType;
  NotFound?: ComponentType;
  meta?: MetaFn<UiContext<ComposeMiddleware<TMiddleware>>>;
}
```

Same pattern for `defineApiRoutes` — the `handler` receives an `HttpContext<State>`
whose `State` is the intersection of every middleware's contribution.

## `defineMiddleware` — Overloads

Three overloads. Every overload is a pure identity — `defineMiddleware(x) === x`
at runtime.

```typescript
// Overload 1 — function form (anonymous, minimal)
export function defineMiddleware<
  TContext extends MiddlewareContextBase = PipeContext,
  TResult = unknown,
  TParams extends unknown[] = [],
>(
  handler: MiddlewareHandler<TContext, TResult, TParams>
): MiddlewareDefinition<TContext, TResult, {}, TParams>;

// Overload 2 — options form (metadata + handler)
export function defineMiddleware<
  TContext extends MiddlewareContextBase = PipeContext,
  TResult = unknown,
  TStateAdditions extends object = {},
  TParams extends unknown[] = [],
>(
  options: MiddlewareOptions<TContext, TResult, TStateAdditions, TParams>
): MiddlewareDefinition<TContext, TResult, TStateAdditions, TParams>;

// Overload 3 — class form (via resolve)
export function defineMiddleware<
  TContext extends MiddlewareContextBase = PipeContext,
  TResult = unknown,
  TStateAdditions extends object = {},
  TParams extends unknown[] = [],
>(
  cls: Type<{ handle: MiddlewareHandler<TContext, TResult, TParams> }>
): MiddlewareDefinition<TContext, TResult, TStateAdditions, TParams>;

// Implementation — pure identity
export function defineMiddleware(input: unknown): unknown {
  return input;
}
```

The `stage` field on options infers the `TContext` type — a discriminated
overload resolves to `HttpContext` when `stage: 'http'`, `UiContext` when
`stage: 'ui'`, `PipeContext` otherwise. This is implemented via conditional
type resolution inside `MiddlewareOptions`.

## `defineMiddlewareGroup`

Sibling primitive for grouping named middleware into reusable presets that
can be referenced by name (`'@web'`, `'@api'`).

```typescript
export interface MiddlewareGroup {
  readonly name: string; // must begin with '@'
  readonly middleware: readonly MiddlewareDefinition[];
  readonly runOn?: 'server' | 'client' | 'both';
}

export function defineMiddlewareGroup(group: MiddlewareGroup): MiddlewareGroup {
  return group;
}
```

Groups can nest — a group can reference another group by name. The resolver
flattens nested groups during resolution and reports cycles.

## Runtime Design

### `MiddlewareRegistry`

DI service registered under the token `MIDDLEWARE_REGISTRY` in
`@stackra/contracts`. Holds every globally registered middleware and every
group.

```typescript
@Injectable()
export class MiddlewareRegistry {
  register(definition: MiddlewareDefinition): void;
  registerGroup(group: MiddlewareGroup): void;
  get(name: string): MiddlewareDefinition | undefined;
  getGroup(name: string): MiddlewareGroup | undefined;
  list(): MiddlewareDefinition[];
  listGroups(): MiddlewareGroup[];
}
```

The registry is populated during `MiddlewareModule.forRoot({ middleware, groups })`
bootstrap. Duplicate names emit a warning and replace the earlier entry
(matches Requirement 19.4).

### `MiddlewareResolver`

DI service responsible for producing an ordered `MiddlewareDefinition[]` given
a route resolution input. Consumers do not call the resolver directly — it is
invoked by `@stackra/ssr/server` (per HTTP request) and by `@stackra/ssr`
(per client-side navigation).

```typescript
@Injectable()
export class MiddlewareResolver {
  constructor(
    @Inject(MIDDLEWARE_REGISTRY) private readonly registry: MiddlewareRegistry,
    @Inject(APPLICATION) private readonly container: IApplication,
    @Optional() @Inject(LOGGER_MANAGER) private readonly logger?: ILoggerManager
  ) {}

  resolve(input: RouteResolutionInput): ResolvedMiddleware[];
}

export interface RouteResolutionInput {
  stage: 'http' | 'ui' | 'pipe';
  environment: 'server' | 'client';
  route?: {
    middleware?: readonly (MiddlewareDefinition | string | MiddlewareTuple)[];
    guards?: readonly MiddlewareDefinition[];
  };
  extras?: readonly MiddlewareDefinition[];
}

export interface ResolvedMiddleware {
  readonly definition: MiddlewareDefinition;
  readonly resolved: {
    readonly name: string | 'anonymous';
    readonly priority: number;
    readonly stage: 'http' | 'ui' | 'pipe';
    readonly inclusionReason: 'global' | 'group' | 'route';
  };
}
```

Resolution algorithm (deterministic, idempotent — per Requirement 18.6):

1. **Collect candidates**. Start with the registry's global middleware.
   Concatenate group members. Concatenate route middleware and guards. Preserve
   declaration order at every step.
2. **Environment filter**. Drop middleware whose `runOn` conflicts with
   `input.environment`.
3. **Enabled filter**. Evaluate each middleware's `enabled` predicate. Drop
   `false` entries. Wrap thrown errors in `MiddlewareResolutionError` with code
   `MIDDLEWARE_ENABLED_THREW`.
4. **Stage filter**. Drop middleware whose declared `stage` disagrees with
   `input.stage`. Raise `MIDDLEWARE_STAGE_MISMATCH` if a route explicitly
   attaches an incompatible middleware.
5. **Reference resolution**. Replace every string reference with the referenced
   `MiddlewareDefinition` from the registry. Raise `MIDDLEWARE_UNKNOWN_REFERENCE`
   for unknown names. Anonymous middleware referenced by name always raises
   this error (per Requirement 19.3).
6. **Constraint graph**. Build a DAG where nodes are middleware and edges are
   `dependsOn` / `runsBefore` / `runsAfter` constraints.
7. **Cycle detection**. Tarjan's SCC or Kahn's topological sort — raise
   `MIDDLEWARE_CYCLE_DETECTED` with the participating names.
8. **Priority-aware topological sort**. Kahn's algorithm with a priority queue
   keyed by `(descending priority, ascending declaration index)`. Yields a
   stable order that respects both constraints and priority.
9. **Attach `resolved` metadata** and return.

### `toPipe` Adapter

Turns a `MiddlewareDefinition` into a `PipeType` compatible with
`Pipeline.through([...])`. Called by every consumer surface at chain-execution
time.

```typescript
export function toPipe<TCtx extends MiddlewareContextBase>(
  middleware: MiddlewareDefinition<TCtx, unknown, object, unknown[]>,
  container: IApplication
): PipeType {
  // Function form → PipeClosure that adapts pipeline (passable, next) → middleware (ctx, next)
  if (typeof middleware === 'function' && !isClass(middleware)) {
    return async (passable: MiddlewareContextBase, next) => {
      return middleware(passable as TCtx, wrapNext(next));
    };
  }

  // Class form (constructor with 'resolve' capability) → object pipe with lazy container resolution
  if (isClass(middleware)) {
    return {
      handle: async (passable: MiddlewareContextBase, next) => {
        const instance = container.get(middleware);
        return instance.handle(passable as TCtx, wrapNext(next));
      },
    };
  }

  // Options form — dispatch on `handle` vs `resolve`
  const options = middleware as MiddlewareOptions<TCtx, unknown, object, unknown[]>;
  if (options.handle) {
    return async (passable: MiddlewareContextBase, next) => {
      return options.handle!(passable as TCtx, wrapNext(next));
    };
  }
  if (options.resolve) {
    return {
      handle: async (passable: MiddlewareContextBase, next) => {
        const instance = container.get(options.resolve!);
        return instance.handle(passable as TCtx, wrapNext(next));
      },
    };
  }

  throw new MiddlewareExecutionError(
    'Middleware has neither `handle` nor `resolve`',
    'MIDDLEWARE_UNINVOKABLE'
  );
}
```

`wrapNext` bridges the pipeline's `(passable) => Promise<unknown>` signature to
the middleware's `MiddlewareNext<TResult>` signature. It also enforces the
call-once contract (Requirement 12.4) — a subsequent `next()` throws
`MiddlewareExecutionError` with code `NEXT_CALLED_MULTIPLE_TIMES`.

### Multiple `next()` Enforcement

```typescript
function wrapNext<TResult>(
  pipelineNext: (passable: unknown) => Promise<TResult>
): MiddlewareNext<TResult> {
  let called = false;
  return async (ctxOverride) => {
    if (called) {
      throw new MiddlewareExecutionError(
        'next() called more than once',
        'NEXT_CALLED_MULTIPLE_TIMES'
      );
    }
    called = true;
    return pipelineNext(ctxOverride);
  };
}
```

## Short-Circuit Signals

Three signal classes. Each is `throw`n by middleware and caught at the
outermost pipeline boundary. Each carries enough metadata for the outer
runtime (`@stackra/ssr/server` for HTTP, `@stackra/ssr` for UI) to produce a
stage-appropriate result.

```typescript
export class RedirectSignal extends Error {
  readonly name = 'RedirectSignal';
  readonly kind = 'redirect' as const;
  constructor(
    readonly url: string,
    readonly status: number = 302
  ) {
    super(`Redirect → ${url} (${status})`);
    if (status < 300 || status > 308) {
      throw new TypeError(`Redirect status must be 300–308, got ${status}`);
    }
  }
}

export class NotFoundSignal extends Error {
  readonly name = 'NotFoundSignal';
  readonly kind = 'not-found' as const;
  constructor(readonly reason: string = 'Not Found') {
    super(reason);
  }
}

export class AbortSignal extends Error {
  readonly name = 'AbortSignal';
  readonly kind = 'abort' as const;
  constructor(readonly result: unknown) {
    super('Abort');
  }
}

export function redirect(url: string, status: number = 302): never {
  throw new RedirectSignal(url, status);
}

export function notFound(reason?: string): never {
  throw new NotFoundSignal(reason);
}

export function abort(result: unknown): never {
  throw new AbortSignal(result);
}
```

The outer runtime catches the signal:

```typescript
// @stackra/ssr/server — HTTP stage
try {
  const result = await pipeline.send(ctx).through(pipes).thenReturn();
  return toResponse(result);
} catch (signal) {
  if (signal instanceof RedirectSignal) {
    return new Response(null, { status: signal.status, headers: { Location: signal.url } });
  }
  if (signal instanceof NotFoundSignal) {
    return new Response(signal.reason, { status: 404 });
  }
  if (signal instanceof AbortSignal) {
    return toResponse(signal.result);
  }
  throw signal; // real error — bubbles to error handler
}
```

The UI runtime performs equivalent handling with client-side navigation for
redirects and nearest-boundary rendering for not-found.

## Error Handling

`MiddlewareExecutionError` wraps any non-signal error thrown by a middleware
handler. It carries the middleware name, stage, and original error as `cause`.

```typescript
export class MiddlewareExecutionError extends Error {
  readonly name = 'MiddlewareExecutionError';
  constructor(
    message: string,
    readonly code: MiddlewareExecutionErrorCode,
    readonly meta?: { middlewareName?: string; stage?: string; cause?: unknown }
  ) {
    super(message, { cause: meta?.cause });
  }
}

export type MiddlewareExecutionErrorCode =
  | 'NEXT_CALLED_MULTIPLE_TIMES'
  | 'MIDDLEWARE_RESOLUTION_FAILED'
  | 'MIDDLEWARE_UNINVOKABLE'
  | 'SYNC_PIPELINE_ASYNC_MIDDLEWARE'
  | 'HANDLER_THREW';
```

`MiddlewareResolutionError` covers resolution-time failures — reference
resolution, cycle detection, stage mismatch, enabled-predicate throw.

```typescript
export class MiddlewareResolutionError extends Error {
  readonly name = 'MiddlewareResolutionError';
  constructor(
    message: string,
    readonly code: MiddlewareResolutionErrorCode,
    readonly meta?: Record<string, unknown>
  ) {
    super(message);
  }
}

export type MiddlewareResolutionErrorCode =
  | 'MIDDLEWARE_UNKNOWN_REFERENCE'
  | 'MIDDLEWARE_CYCLE_DETECTED'
  | 'MIDDLEWARE_STAGE_MISMATCH'
  | 'MIDDLEWARE_ENABLED_THREW';
```

Both classes preserve the `cause` chain so upstream error reporters
(`@stackra/logger`) can render the full stack.

## Registration

### Global Registration — `MiddlewareModule.forRoot`

```typescript
@Module({})
export class MiddlewareModule {
  static forRoot(options: {
    middleware?: readonly MiddlewareDefinition[];
    groups?: readonly MiddlewareGroup[];
  }): DynamicModule {
    return {
      module: MiddlewareModule,
      global: true,
      providers: [
        MiddlewareRegistry,
        MiddlewareResolver,
        { provide: MIDDLEWARE_REGISTRY, useExisting: MiddlewareRegistry },
        { provide: MIDDLEWARE_RESOLVER, useExisting: MiddlewareResolver },
        {
          provide: MIDDLEWARE_BOOTSTRAP,
          useFactory: (registry: MiddlewareRegistry) => {
            for (const m of options.middleware ?? []) registry.register(m);
            for (const g of options.groups ?? []) registry.registerGroup(g);
            return true;
          },
          inject: [MiddlewareRegistry],
        },
      ],
      exports: [MIDDLEWARE_REGISTRY, MIDDLEWARE_RESOLVER, MiddlewareRegistry, MiddlewareResolver],
    };
  }

  static forRootAsync(options: IAsyncModuleOptions<MiddlewareModuleOptions>): DynamicModule {
    // Symmetric with forRoot but resolves options via useFactory + inject.
  }

  /** Extend the registry from a feature module. */
  static forFeature(options: {
    middleware?: readonly MiddlewareDefinition[];
    groups?: readonly MiddlewareGroup[];
  }): DynamicModule {
    // Registers into the global registry via a lifecycle provider.
  }
}
```

`MIDDLEWARE_BOOTSTRAP` is a synthetic token whose provider factory is invoked
eagerly at container init, ensuring middleware and groups land in the registry
before any route resolves.

### Per-Route Registration

Consumers pass middleware directly into `defineApiRoutes` and `defineRoutes`.
The framework calls `MiddlewareResolver.resolve()` at the right lifecycle
point (per HTTP request for API routes; per client navigation for UI routes)
to produce the final ordered chain.

```typescript
// API route
export const apiRoutes = defineApiRoutes([
  {
    path: '/api/users/:id',
    method: 'GET',
    middleware: [
      authMiddleware, // by reference
      'rate-limit', // by registered name
      '@api', // by group name
      [rateLimitMiddleware, { perMin: 60 }], // tuple with params
    ],
    handler: async ({ params, container, state }) => {
      /* ... */
    },
  },
]);

// UI route
export const routes = defineRoutes([
  {
    path: '/dashboard',
    middleware: [requireAuth, requireRole('admin')], // guards flavour
    lazy: () => import('@/pages/dashboard'),
  },
]);
```

## Tuple Parameterization

Tuples let a reusable middleware receive per-invocation params. The
`MiddlewareResolver` recognises `[middleware, ...params]` shapes and forwards
them to the pipeline runtime's existing tuple support.

```typescript
export type MiddlewareTuple<
  TDef extends MiddlewareDefinition = MiddlewareDefinition,
  TParams extends unknown[] = [],
> = readonly [TDef, ...TParams];

// Usage
const rateLimit = defineMiddleware({
  name: 'rate-limit',
  handle: async (ctx: HttpContext, next, options: { perMin: number }) => {
    // options is typed
  },
});

apiRoutes: [{ middleware: [[rateLimit, { perMin: 60 }]] }];
```

## Registry Introspection

`MiddlewareRegistry.list()` returns every registered definition. The
`ResolvedMiddleware` shape returned from `MiddlewareResolver.resolve()`
includes the effective priority, stage, and inclusion reason. Dev tooling can
render this as a per-route middleware diagram.

## Testing

`createMockContext(stage, overrides?)` — returns a stage-appropriate mock
context with defaults suitable for isolated unit tests.

```typescript
export function createMockContext<TStage extends 'http' | 'ui' | 'pipe'>(
  stage: TStage,
  overrides?: Partial<ContextForStage<TStage>>
): ContextForStage<TStage> & {
  runMiddleware<TResult>(
    mw: MiddlewareDefinition<ContextForStage<TStage>, TResult>,
    next?: MiddlewareNext<TResult>
  ): Promise<TResult>;
};
```

The returned mock exposes an assertable container proxy (via
`@stackra/testing`) so tests can assert on `container.get()` calls made from
middleware handlers.

## Package Layout

```
ssr/
├── src/
│   ├── core/                       # isomorphic root — router, client entry
│   │   ├── constants/
│   │   ├── decorators/
│   │   ├── enums/                  # SsrMode
│   │   ├── errors/                 # SsrError
│   │   ├── interfaces/
│   │   ├── services/               # ClientRouter, MetaCollector, LoaderCache
│   │   ├── types/
│   │   ├── utils/                  # defineRoutes, defineLoader, defineMeta, defineConfig, mergeConfig
│   │   ├── hooks/                  # useLoaderData, useMeta, useRouteError, usePreload
│   │   ├── components/             # <StackraRouter>, <StackraLink>, <Meta>, <Outlet>
│   │   ├── ssr.module.ts
│   │   └── index.ts
│   │
│   ├── middleware/                 # THIS SPEC
│   │   ├── constants/
│   │   │   ├── metadata-keys.constant.ts
│   │   │   └── index.ts
│   │   ├── enums/
│   │   │   ├── middleware-stage.enum.ts
│   │   │   └── index.ts
│   │   ├── errors/
│   │   │   ├── middleware-execution.error.ts
│   │   │   ├── middleware-resolution.error.ts
│   │   │   └── index.ts
│   │   ├── interfaces/
│   │   │   ├── http-context.interface.ts
│   │   │   ├── ui-context.interface.ts
│   │   │   ├── pipe-context.interface.ts
│   │   │   ├── middleware-context-base.interface.ts
│   │   │   ├── middleware-options.interface.ts
│   │   │   ├── middleware-group.interface.ts
│   │   │   ├── middleware-module-options.interface.ts
│   │   │   ├── resolved-middleware.interface.ts
│   │   │   ├── route-resolution-input.interface.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── middleware-definition.type.ts
│   │   │   ├── middleware-handler.type.ts
│   │   │   ├── middleware-next.type.ts
│   │   │   ├── middleware-tuple.type.ts
│   │   │   ├── compose-middleware.type.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── middleware-registry.service.ts
│   │   │   ├── middleware-resolver.service.ts
│   │   │   └── index.ts
│   │   ├── signals/
│   │   │   ├── redirect.signal.ts
│   │   │   ├── not-found.signal.ts
│   │   │   ├── abort.signal.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── define-middleware.util.ts
│   │   │   ├── define-middleware-group.util.ts
│   │   │   ├── compose-middleware.util.ts
│   │   │   ├── to-pipe.util.ts
│   │   │   ├── wrap-next.util.ts
│   │   │   ├── is-class.util.ts
│   │   │   ├── redirect.util.ts
│   │   │   ├── not-found.util.ts
│   │   │   ├── abort.util.ts
│   │   │   ├── define-config.util.ts
│   │   │   ├── merge-config.util.ts
│   │   │   └── index.ts
│   │   ├── middleware.module.ts
│   │   └── index.ts
│   │
│   ├── server/                     # HTTP + SSR rendering (out of scope for this spec)
│   ├── react/                      # React ergonomics (out of scope)
│   ├── vite/                       # Vite plugin (out of scope)
│   └── testing/
│       ├── create-mock-context.ts
│       ├── run-middleware.ts
│       ├── mock-container.ts
│       └── index.ts
│
├── config/
│   └── middleware.config.ts        # Laravel-style config template
│
├── __tests__/
│   ├── unit/
│   │   ├── define-middleware.test.ts
│   │   ├── compose-middleware.test.ts
│   │   ├── to-pipe.test.ts
│   │   ├── middleware-resolver.test.ts
│   │   ├── middleware-registry.test.ts
│   │   ├── signals.test.ts
│   │   └── wrap-next.test.ts
│   ├── feature/
│   │   ├── module-forroot.test.ts
│   │   ├── pipeline-interop.test.ts
│   │   └── end-to-end.test.ts
│   ├── types/
│   │   ├── state-chaining.test-d.ts
│   │   ├── overload-inference.test-d.ts
│   │   └── tuple-params.test-d.ts
│   ├── property/
│   │   └── resolver-properties.test.ts
│   └── vitest.setup.ts
```

## Contracts Additions

New symbols in `@stackra/contracts` — all cross-package.

**Tokens** (`contracts/src/tokens/middleware.tokens.ts`):

```typescript
export const MIDDLEWARE_REGISTRY = Symbol.for('MIDDLEWARE_REGISTRY');
export const MIDDLEWARE_RESOLVER = Symbol.for('MIDDLEWARE_RESOLVER');
export const MIDDLEWARE_CONFIG = Symbol.for('MIDDLEWARE_CONFIG');
```

**Events** (`contracts/src/events/middleware.events.ts`):

```typescript
export const MIDDLEWARE_EVENTS = {
  RESOLVED: 'middleware.resolved',
  EXECUTION_STARTED: 'middleware.execution-started',
  EXECUTION_COMPLETED: 'middleware.execution-completed',
  EXECUTION_FAILED: 'middleware.execution-failed',
  SHORT_CIRCUITED: 'middleware.short-circuited',
} as const;
export type MiddlewareEventName = (typeof MIDDLEWARE_EVENTS)[keyof typeof MIDDLEWARE_EVENTS];
```

**Interfaces** are not published to contracts — they live in
`@stackra/ssr/middleware` because they carry generics and would create a
circular dep with `@stackra/container` if hoisted. Consumers that need to
reference them import from `@stackra/ssr/middleware` directly.

## Interop with `@stackra/pipeline`

### At definition time

Consumers write `defineMiddleware(...)` and never touch the pipeline API
directly. The middleware surface is the primary authoring layer.

### At execution time

The runtime (server or client) creates a `Pipeline`, calls `.send(ctx)`,
`.through(resolvedPipes)`, and `.thenReturn()` — where `resolvedPipes` is the
output of `resolvedChain.map(m => toPipe(m.definition, container))`.

### Direct pipeline use

Consumers who use `@stackra/pipeline` directly (queue processors, custom
async chains) can still author their pipes as `MiddlewareDefinition` values
and rely on `toPipe` for adaptation:

```typescript
const chain = definitions.map((d) => toPipe(d, container));
return await pipeline.send(passable).through(chain).thenReturn();
```

## Configuration Template

Ships in `config/middleware.config.ts` following the Laravel-style banner
pattern used by every other package:

```typescript
import { defineConfig } from '@stackra/ssr/middleware';

export const middlewareConfig = defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Global Middleware
  |--------------------------------------------------------------------------
  |
  | These middleware run on every request or every navigation, in resolved
  | order. Prefer `groups` below when the same set should be reused across
  | many routes rather than made truly global.
  |
  */
  middleware: [],

  /*
  |--------------------------------------------------------------------------
  | Middleware Groups
  |--------------------------------------------------------------------------
  |
  | Reusable presets addressable by name in route definitions via '@name'.
  | Group names must start with an at-sign.
  |
  */
  groups: [
    // defineMiddlewareGroup({ name: '@web', middleware: [/* ... */] }),
  ],
});
```

## Public API Surface (per-subpath)

**`@stackra/ssr/middleware`** — the primitive.

```typescript
// Primitives
export { defineMiddleware, defineMiddlewareGroup, composeMiddleware, toPipe };

// Signal helpers
export { redirect, notFound, abort };

// Signal classes (for instanceof checks and error handlers)
export { RedirectSignal, NotFoundSignal, AbortSignal };

// Module
export { MiddlewareModule };

// Services (also accessible via DI tokens from @stackra/contracts)
export { MiddlewareRegistry, MiddlewareResolver };

// Errors
export { MiddlewareExecutionError, MiddlewareResolutionError };

// Types
export type {
  MiddlewareDefinition,
  MiddlewareHandler,
  MiddlewareNext,
  MiddlewareOptions,
  MiddlewareGroup,
  MiddlewareTuple,
  MiddlewareStage,
  MiddlewareRunOn,
  ResolvedMiddleware,
  RouteResolutionInput,
  ComposeMiddleware,
};

// Contexts
export type { MiddlewareContextBase, HttpContext, UiContext, PipeContext };

// Config
export { defineConfig, mergeConfig };
```

**`@stackra/ssr/testing`** — test helpers (existing subpath, extended).

```typescript
export { createMockContext, runMiddleware, createMockContainer };
```

## Correctness Properties (Requirement 18)

The resolver is deliberately deterministic and idempotent. Property tests
verify:

1. **Definition-order invariance under equal priority** — two chains with the
   same middleware set but different declaration orders produce the same
   resolved order iff no priority or constraint distinguishes them.
2. **Idempotence of resolution** — `resolve(input)` called twice with the same
   input produces structurally equal outputs.
3. **State propagation** — after a chain executes, the terminal context's
   `state` reflects every `next({ ...ctx, state: {...} })` mutation from
   upstream middleware.
4. **Short-circuit boundary** — after a short-circuit, no downstream middleware
   is invoked; middleware that ran before the short-circuit are unaffected.
5. **Metamorphic prefix additions** — adding a middleware that only calls
   `next()` without mutating state does not change the destination's state.

Property-based tests use `fast-check` to generate middleware chains of length
0..10 with random priority, `runOn`, and constraint patterns.

## Dev / Debug Hooks

The resolver emits `MIDDLEWARE_EVENTS.RESOLVED` via `@stackra/events`
with the full `ResolvedMiddleware[]` payload after each resolution.
Dev tooling subscribes to this event to render per-route chains in a
diagnostic panel.

The runtime emits `EXECUTION_STARTED` / `EXECUTION_COMPLETED` /
`EXECUTION_FAILED` / `SHORT_CIRCUITED` per middleware invocation. Optional
`@stackra/logger` integration logs these at `debug` level.

## Migration Notes

`@stackra/ssr/middleware` is the canonical surface. There is no separate
`@stackra/middleware` package. Every requirement statement in
`requirements.md` referring to `@stackra/middleware`, `@stackra/middleware/testing`,
or the standalone package's `package.json` is rebound onto `@stackra/ssr`,
`@stackra/ssr/middleware`, and `@stackra/ssr/testing` respectively.

## Out of Scope

- Concrete built-in middleware (auth, rate limit, CORS, CSP, body parser,
  logging, tracing) — covered by a follow-up spec that lands in
  `@stackra/ssr/server` for HTTP-stage builtins and `@stackra/ssr` root for
  UI-stage builtins (Requirement 21).
- The SSR renderer itself, streaming pipeline, and Vite plugin — separate specs.
- React error/loading boundary integration — handled at the `defineRoutes`
  layer, not by the middleware primitive.
- SSG / prerender / crawler detection — separate SEO-focused spec.
