# Requirements Document

## Introduction

`defineMiddleware` is a canonical, type-safe primitive utility that lets
consumers author middleware in a single uniform way across the Stackra
platform. It mirrors the existing `define*` family (`defineConfig`,
`defineRoutes`, `defineApiRoutes`) — a small identity-style helper whose real
value is the type inference and shape it enforces on the input.

The primitive lives in a new `@stackra/middleware` package and is consumed by
`@stackra/pipeline` (foundation runtime), `@stackra/server` (HTTP request
handlers and API route registration), and `@stackra/ssr` (UI route guards and
loaders). Every middleware defined via `defineMiddleware` is a valid pipe for
the `@stackra/pipeline` runtime, so the underlying execution machinery is
unchanged. The primitive supplies:

- A uniform authoring surface (function form, class form, options form).
- A strongly-typed `MiddlewareContext<T>` per stage (HTTP, UI, generic pipe).
- Composition metadata (`name`, `priority`, `dependsOn`, `runsBefore`,
  `runsAfter`, `runOn`, `enabled`).
- Type-level state chaining, so a middleware that adds `state.user: User` is
  observable in the types of downstream middleware.
- Short-circuit signals (`redirect`, `notFound`, `abort`) with well-defined
  runtime semantics.
- A test harness (`createMockContext`) that composes with `@stackra/testing`.

This document captures the functional and non-functional requirements for the
primitive, its runtime, its registration surfaces, and its testing story.

## Glossary

| Term                 | Definition                                                                                                                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Middleware           | A named, ordered unit of composable behavior authored via `defineMiddleware`. Wraps a handler that receives a typed context and a `next` continuation, and returns (possibly asynchronously) a result of a stage type |
| Pipe                 | The lowest-level executable unit understood by `@stackra/pipeline`. May be a closure, string token, object with `handle`, or `[pipe, ...params]` tuple                                                                |
| Passable             | The value flowing through the pipeline. For HTTP it is a request/response envelope; for UI it is a navigation envelope; for generic pipes it is arbitrary                                                             |
| Context              | The typed argument passed to a middleware handler. Has stage-specific shape (`HttpContext`, `UiContext`, `PipeContext`) and carries a mutable `state` object                                                          |
| Stage                | The runtime location where a middleware executes. One of `http` (server request lifecycle), `ui` (client-side route guard/loader), or `pipe` (generic passable)                                                       |
| `runOn`              | The environment restriction for a middleware. One of `'server'`, `'client'`, or `'both'`. Controls which stages the middleware participates in                                                                        |
| Guard                | A UI-stage middleware whose primary role is to authorize or redirect a navigation before route rendering. Semantically a middleware with a UI context                                                                 |
| PipelineHub          | The named-pipeline preset registry from `@stackra/pipeline`. Enables reusable middleware chains addressable by name                                                                                                   |
| MiddlewareRegistry   | The registry (provided by `@stackra/middleware`) that holds globally registered middleware definitions, their metadata, and their resolved execution order                                                            |
| MiddlewareResolver   | The service responsible for taking a set of middleware definitions plus per-route additions, resolving dependencies and priorities, and producing an ordered array of pipes for the pipeline runtime                  |
| Short-circuit        | A control-flow signal (thrown or returned) that aborts pipeline execution and produces a final result without running remaining middleware                                                                            |
| Redirect Signal      | A short-circuit produced by `redirect(url, status?)` that maps to an HTTP redirect response (server) or a client-side navigation (UI)                                                                                 |
| NotFound Signal      | A short-circuit produced by `notFound()` that maps to a 404 response (server) or the nearest UI `NotFound` boundary (UI)                                                                                              |
| Abort Signal         | A short-circuit produced by `abort(response)` (server) or `abort(result)` (generic) that returns a fully-formed result without further processing                                                                     |
| State Chain          | The compile-time evolution of the context's `state` type across a sequence of middleware, where each middleware may add or refine properties observable by downstream middleware                                      |
| Anonymous Middleware | A middleware defined without a `name` property. Cannot be referenced by `dependsOn`, `runsAfter`, `runsBefore`, or DI string tokens                                                                                   |
| Named Middleware     | A middleware defined with a stable string `name`. Registrable in the `MiddlewareRegistry` and addressable in composition metadata                                                                                     |

## Requirements

### Requirement 1: `defineMiddleware` Primitive Signature and Overloads

**User Story:** As an API author, I want a single `defineMiddleware` primitive
with clear overloads for function, class, and options forms, so that I can
author middleware once and consume it uniformly across HTTP routes, UI routes,
and generic pipelines.

#### Acceptance Criteria

1. THE Middleware_Package SHALL export a `defineMiddleware` function from `@stackra/middleware`.
2. THE `defineMiddleware` function SHALL implement identity semantics: for every legal input value `x`, the runtime return value SHALL be reference-equal to `x` (`defineMiddleware(x) === x`).
3. WHEN `defineMiddleware` is called with a handler function of shape `(ctx, next) => result | Promise<result>`, THE Middleware_Package SHALL return the same function reference typed as `MiddlewareDefinition`.
4. WHEN `defineMiddleware` is called with an options object containing a `handle` property, THE Middleware_Package SHALL return the same object reference typed as `MiddlewareDefinition`, preserving every option field verbatim.
5. WHEN `defineMiddleware` is called with a class constructor annotated as injectable, THE Middleware_Package SHALL return the same class reference typed as `MiddlewareDefinition`.
6. WHERE the options form is used, THE Middleware_Package SHALL accept the fields `name`, `handle`, `priority`, `enabled`, `runOn`, `dependsOn`, `runsBefore`, `runsAfter`, `stage`, and `resolve`, and SHALL reject unknown fields at the type level.
7. WHEN `defineMiddleware` returns a `MiddlewareDefinition`, THE Middleware_Package SHALL preserve the input's inferred generic parameters `TContext`, `TResult`, and `TStateAdditions` in the returned type without widening.
8. IF `defineMiddleware` is invoked with an options object containing both a `handle` function and a `resolve` class, THEN THE TypeScript_Compiler SHALL raise a type error at the call site.
9. THE `defineMiddleware` implementation SHALL contain no runtime logic other than returning its argument, so that a minifier can inline the call to zero runtime overhead.

### Requirement 2: Middleware Context Shape by Stage

**User Story:** As an API author, I want a strongly-typed context that reflects
the stage I am authoring for (HTTP, UI, or generic pipe), so that autocomplete
and type checking guide me to the right fields.

#### Acceptance Criteria

1. THE Middleware_Package SHALL export three stage-specific context types: `HttpContext<TState>`, `UiContext<TState>`, and `PipeContext<TPassable, TState>`.
2. THE `HttpContext<TState>` SHALL expose the fields `request`, `response`, `container`, `state`, `params`, and `url`, where `state` has the type `TState`.
3. THE `UiContext<TState>` SHALL expose the fields `location`, `container`, `state`, `matches`, `params`, and `signal`, where `signal` is an `AbortSignal` and `state` has the type `TState`.
4. THE `PipeContext<TPassable, TState>` SHALL expose the fields `passable`, `container`, and `state`, where `state` has the type `TState`.
5. WHEN a middleware is declared with `stage: 'http'`, THE Middleware_Package SHALL infer its context type as `HttpContext<TState>`.
6. WHEN a middleware is declared with `stage: 'ui'`, THE Middleware_Package SHALL infer its context type as `UiContext<TState>`.
7. WHEN a middleware is declared with `stage: 'pipe'` or `stage` is omitted, THE Middleware_Package SHALL infer its context type as `PipeContext<TPassable, TState>`.
8. THE `container` field on every context SHALL be an `IApplication` instance from `@stackra/contracts` when the middleware executes under a DI-owned runtime.

### Requirement 3: Type-Level State Chaining

**User Story:** As a platform author, I want a middleware that adds
`state.user: User` to be observable in the types of downstream middleware, so
that consumers get full autocomplete on properties that earlier middleware
guarantee.

#### Acceptance Criteria

1. THE `MiddlewareDefinition<TContext, TResult, TStateAdditions>` type SHALL carry a third generic parameter `TStateAdditions` describing the shape a middleware contributes to `state`.
2. WHEN a middleware's `handle` returns `next({ ...ctx, state: { ...ctx.state, user } })`, THE Middleware_Package SHALL infer `TStateAdditions` as `{ user: User }` from the shape passed to `next`.
3. WHEN a sequence of middleware `[A, B, C]` is composed via `composeMiddleware(...)`, THE Middleware_Package SHALL compute a cumulative state type that is the intersection of the initial state with each middleware's `TStateAdditions` in declaration order.
4. WHEN a downstream middleware references a state property added by an upstream middleware in the same composition, THE Middleware_Package SHALL resolve the property with its upstream-declared type and SHALL NOT widen to `unknown` or `any`.
5. IF a middleware attempts to read `ctx.state.<property>` where `<property>` is not present in any preceding middleware's `TStateAdditions` or in the initial state type, THEN THE TypeScript_Compiler SHALL produce a type error at the call site.

### Requirement 4: Composition Metadata — Priority, Dependencies, Ordering

**User Story:** As an app author, I want to declare `priority`, `dependsOn`,
`runsBefore`, and `runsAfter` on my middleware, so that execution order is
deterministic and independent of the order I list middleware in a route.

#### Acceptance Criteria

1. THE `MiddlewareDefinition` type SHALL accept an optional `priority` field of type `number`, defaulting to `0` when unset.
2. WHEN a set of middleware is resolved with only `priority` metadata, THE Middleware_Resolver SHALL sort them in descending order of `priority`, with ties broken by declaration order.
3. THE `MiddlewareDefinition` type SHALL accept optional `dependsOn`, `runsBefore`, and `runsAfter` fields, each an array of middleware names or `MiddlewareDefinition` references.
4. WHEN a set of middleware is resolved with `dependsOn` metadata, THE Middleware_Resolver SHALL produce an order that places every dependency strictly before its dependent.
5. WHEN a set of middleware is resolved with `runsBefore` and `runsAfter` metadata, THE Middleware_Resolver SHALL produce an order that satisfies every declared before/after relation.
6. IF the resolver detects a cycle among `dependsOn`, `runsBefore`, and `runsAfter` constraints, THEN THE Middleware_Resolver SHALL raise a `MiddlewareResolutionError` with code `MIDDLEWARE_CYCLE_DETECTED` and SHALL include the participating middleware names in the error message.
7. IF a middleware references an unknown name in `dependsOn`, `runsBefore`, or `runsAfter`, THEN THE Middleware_Resolver SHALL raise a `MiddlewareResolutionError` with code `MIDDLEWARE_UNKNOWN_REFERENCE` and SHALL include the missing name and the referencing middleware's name.
8. WHEN two middleware have equal effective priority and no ordering constraint between them, THE Middleware_Resolver SHALL preserve their declaration order.

### Requirement 5: `runOn` Environment Restriction

**User Story:** As an app author, I want to declare whether a middleware runs
on the server, the client, or both, so that the framework skips it in the
wrong environment without me writing environment checks in every handler.

#### Acceptance Criteria

1. THE `MiddlewareDefinition` type SHALL accept an optional `runOn` field of type `'server' | 'client' | 'both'`, defaulting to `'both'` when unset.
2. WHERE `runOn` is `'server'`, THE Middleware_Resolver SHALL include the middleware in the resolved chain WHEN the current environment is server-side and SHALL exclude it otherwise.
3. WHERE `runOn` is `'client'`, THE Middleware_Resolver SHALL include the middleware in the resolved chain WHEN the current environment is client-side and SHALL exclude it otherwise.
4. WHERE `runOn` is `'both'`, THE Middleware_Resolver SHALL include the middleware in the resolved chain in both environments.
5. WHEN a middleware is excluded from the chain due to `runOn`, THE Middleware_Resolver SHALL skip class resolution and handler invocation for that middleware and SHALL treat downstream middleware as if the excluded middleware were absent for the purposes of `dependsOn` ordering.

### Requirement 6: `enabled` Flag

**User Story:** As an app author, I want to disable a middleware without
removing it from the definition list, so that feature flags and A/B toggles
can control activation.

#### Acceptance Criteria

1. THE `MiddlewareDefinition` type SHALL accept an optional `enabled` field of type `boolean` or `(container: IApplication) => boolean`, defaulting to `true` when unset.
2. WHEN `enabled` is `false`, THE Middleware_Resolver SHALL exclude the middleware from the resolved chain.
3. WHEN `enabled` is a function, THE Middleware_Resolver SHALL invoke the function once per resolution pass with the active container and SHALL include the middleware only when the function returns `true`.
4. IF the `enabled` function throws, THEN THE Middleware_Resolver SHALL raise a `MiddlewareResolutionError` with code `MIDDLEWARE_ENABLED_THREW` and SHALL include the middleware name and the original error as `cause`.

### Requirement 7: Interop with `@stackra/pipeline`

**User Story:** As a framework author, I want every middleware defined via
`defineMiddleware` to be a valid pipe accepted by the existing `Pipeline`
runtime, so that no parallel execution engine needs to exist.

#### Acceptance Criteria

1. THE Middleware_Package SHALL export a `toPipe(middleware, container)` adapter that returns a `PipeType` compatible with `Pipeline.through()`.
2. WHEN `toPipe` is invoked with a function-form middleware, THE Middleware_Package SHALL return a `PipeClosure` that maps `(passable, next)` from the pipeline runtime onto `(ctx, next)` for the middleware.
3. WHEN `toPipe` is invoked with a class-form middleware, THE Middleware_Package SHALL return a pipe object whose `handle(passable, next)` resolves the class via the container and delegates to the resolved instance's `handle(ctx, next)`.
4. WHEN a `MiddlewareDefinition` is passed directly to `Pipeline.through([...])`, THE Pipeline SHALL invoke `toPipe` internally and execute the middleware without the consumer performing the wrap manually.
5. WHEN the pipeline runtime advances to the next pipe via `next(passable)`, THE Middleware_Adapter SHALL preserve every mutation the middleware made to `ctx.state` in the passable forwarded to the next pipe.
6. WHEN a `PipelineHub` preset is defined via `hub.pipeline(name, (pipeline, passable) => pipeline.send(passable).through([mw1, mw2]).thenReturn())`, THE Middleware_Package SHALL accept `mw1` and `mw2` as `MiddlewareDefinition` values without additional wrapping.

### Requirement 8: DI Integration for Class-Form Middleware

**User Story:** As a platform author, I want class-form middleware to receive
their constructor dependencies from the DI container, so that services like
loggers, auth providers, and repositories are available inside `handle`.

#### Acceptance Criteria

1. WHEN a middleware definition provides a `resolve` class reference, THE Middleware_Adapter SHALL obtain the instance by calling `container.get(class)` at execution time.
2. WHEN a middleware definition provides `resolve` and a `name`, THE Middleware_Package SHALL register the class in the container under the name as a string token during `MiddlewareModule.forRoot()` bootstrap.
3. WHEN a class-form middleware has `@Injectable()` metadata and constructor parameters annotated with `@Inject(TOKEN)`, THE Container SHALL inject those dependencies at instantiation.
4. IF `container.get(class)` throws during middleware execution, THEN THE Middleware_Adapter SHALL wrap the error in a `MiddlewareExecutionError` with code `MIDDLEWARE_RESOLUTION_FAILED` and SHALL rethrow.
5. WHERE function-form middleware needs container access, THE Middleware_Adapter SHALL populate the `container` field on `ctx` with the active `IApplication` instance so the handler can call `container.get(TOKEN)` directly.

### Requirement 9: Global Registration via `MiddlewareModule.forRoot`

**User Story:** As an app author, I want to register a list of middleware
globally via `MiddlewareModule.forRoot({ middleware: [...] })`, so that they
apply to every eligible route without per-route wiring.

#### Acceptance Criteria

1. THE Middleware_Package SHALL export a `MiddlewareModule` class with a static `forRoot(options)` method returning an `IDynamicModule`.
2. THE `MiddlewareModule.forRoot` options object SHALL accept a `middleware` field of type `Array<MiddlewareDefinition | ClassConstructor>` and an optional `groups` field of type `Record<string, Array<MiddlewareDefinition | ClassConstructor | string>>`.
3. WHEN `MiddlewareModule.forRoot` is bootstrapped, THE Middleware_Registry SHALL register each middleware from the `middleware` array under its `name` if present.
4. WHEN a global middleware has `runOn: 'server'` or `runOn: 'client'`, THE Middleware_Resolver SHALL apply the environment restriction defined in Requirement 5 to every route that includes it.
5. WHEN a middleware group is defined in `groups`, THE Middleware_Registry SHALL make the group addressable by name so that route registrations can include `'@group-name'` as a shorthand.
6. WHEN a route is resolved, THE Middleware_Resolver SHALL merge the global middleware list, referenced groups, and per-route middleware into a single ordered chain according to Requirement 4.

### Requirement 10: Per-Route Registration in `defineApiRoutes` and `defineRoutes`

**User Story:** As an app author, I want to attach middleware per route inside
`defineApiRoutes` (HTTP) and `defineRoutes` (UI), so that specific routes can
opt into additional behavior without polluting the global chain.

#### Acceptance Criteria

1. WHEN a route entry in `defineApiRoutes` provides a `middleware` field, THE Server_Package SHALL accept an array whose elements may be `MiddlewareDefinition`, class constructors, string names referencing globally registered middleware, `'@group-name'` shorthands, or `[middleware, ...params]` tuples.
2. WHEN a route entry in `defineRoutes` provides a `guards` field, THE Ssr_Package SHALL accept an array whose elements may be `MiddlewareDefinition` values with `stage: 'ui'` or class constructors of UI-stage middleware.
3. WHEN a route has per-route middleware, THE Middleware_Resolver SHALL merge them with the global chain following Requirement 9.6 and resolve ordering per Requirement 4.
4. IF a per-route middleware entry is a string name that does not resolve to a registered middleware or group, THEN THE Middleware_Resolver SHALL raise a `MiddlewareResolutionError` with code `MIDDLEWARE_UNKNOWN_REFERENCE`.
5. WHERE a per-route middleware has a `stage` incompatible with the route type, THE Middleware_Resolver SHALL raise a `MiddlewareResolutionError` with code `MIDDLEWARE_STAGE_MISMATCH` at resolution time.

### Requirement 11: Short-Circuit Signals — `redirect`, `notFound`, `abort`

**User Story:** As an API author, I want to signal a redirect, a not-found, or
a fully-formed early response by throwing a well-known object, so that I do
not have to thread response construction through every downstream handler.

#### Acceptance Criteria

1. THE Middleware_Package SHALL export the helpers `redirect(url, status?)`, `notFound(message?)`, and `abort(result)` that construct throwable signal objects.
2. WHEN a middleware throws the object returned by `redirect(url, status)`, THE Middleware_Runtime SHALL abort the remaining chain and produce a stage-appropriate result: an HTTP response with the configured status (defaulting to `302`) and `Location: url` header on the server; a client-side navigation to `url` on the UI.
3. WHEN a middleware throws the object returned by `notFound(message)`, THE Middleware_Runtime SHALL abort the remaining chain and produce a `404` HTTP response with the message as the body on the server, or SHALL render the nearest `NotFound` boundary on the UI.
4. WHEN a middleware throws the object returned by `abort(result)`, THE Middleware_Runtime SHALL abort the remaining chain and return `result` as the pipeline's terminal value without executing further pipes or the destination.
5. THE `redirect` helper SHALL accept HTTP status codes in the range `300` through `308` inclusive.
6. IF `redirect` is invoked with a status outside `300`–`308`, THEN THE Middleware_Package SHALL throw a `TypeError` at construction time.
7. WHEN a middleware throws an error that is not a recognized short-circuit signal, THE Middleware_Runtime SHALL treat the error as an execution failure and SHALL surface it per Requirement 12.

### Requirement 12: Error Handling Semantics

**User Story:** As an app author, I want unhandled middleware errors to be
surfaced with consistent metadata, so that observability tools and error
boundaries can react correctly.

#### Acceptance Criteria

1. WHEN a middleware `handle` throws an error that is not a recognized short-circuit signal, THE Middleware_Runtime SHALL wrap the error in a `MiddlewareExecutionError` carrying the middleware name (or `'anonymous'`), the stage, and the original error as `cause`.
2. WHEN a `MiddlewareExecutionError` is thrown at the HTTP stage and no downstream error handler catches it, THE Server_Package SHALL produce a `500` response and SHALL log the error via the DI-resolved logger.
3. WHEN a `MiddlewareExecutionError` is thrown at the UI stage and no route error boundary catches it, THE Ssr_Package SHALL render the nearest `ErrorBoundary` slot from `defineRoutes`.
4. WHEN a middleware calls `next()` more than once for the same invocation, THE Middleware_Runtime SHALL throw a `MiddlewareExecutionError` with code `NEXT_CALLED_MULTIPLE_TIMES` on the second call.
5. WHEN a middleware returns without calling `next()` and without throwing a short-circuit signal, THE Middleware_Runtime SHALL treat the returned value as the terminal result of the chain and SHALL NOT invoke downstream pipes.

### Requirement 13: Asynchronous Execution Model

**User Story:** As an API author, I want to write `async` middleware by
default, so that database calls, remote APIs, and stream reads compose
naturally.

#### Acceptance Criteria

1. THE `MiddlewareDefinition` handle signature SHALL be `(ctx, next) => TResult | Promise<TResult>`.
2. WHEN a middleware `handle` returns a `Promise`, THE Middleware_Runtime SHALL await the promise before treating the value as the chain result or advancing.
3. WHEN a middleware `handle` returns a synchronous value, THE Middleware_Runtime SHALL propagate the value without wrapping it in a `Promise`.
4. WHERE the containing runtime is `@stackra/pipeline` running a synchronous `then(destination)`, THE Middleware_Runtime SHALL raise a `MiddlewareExecutionError` with code `SYNC_PIPELINE_ASYNC_MIDDLEWARE` when an async middleware is executed inside it, so consumers do not silently receive a `Promise` as the terminal value.

### Requirement 14: Testing Support — `createMockContext`

**User Story:** As an API author, I want a helper that constructs a
stage-specific mock context with sensible defaults, so that I can unit-test
middleware without booting the full DI container.

#### Acceptance Criteria

1. THE Middleware_Package SHALL export `createMockContext(stage, overrides?)` where `stage` is `'http' | 'ui' | 'pipe'` and `overrides` is a partial context.
2. WHEN `createMockContext('http')` is called, THE Middleware_Package SHALL return an `HttpContext` with a default `request`, a default writable `response`, a default empty `state`, and a container that satisfies `IApplication` and resolves registered tokens.
3. WHEN `createMockContext('ui')` is called, THE Middleware_Package SHALL return a `UiContext` with a default `location`, an empty `matches`, an empty `state`, and a non-aborted `AbortSignal`.
4. WHEN `createMockContext('pipe', { passable })` is called, THE Middleware_Package SHALL return a `PipeContext` whose `passable` is the supplied value.
5. WHERE `@stackra/testing` is available, THE Middleware_Package SHALL expose the mock container as an assertable proxy compatible with `@stackra/testing` expectations.
6. THE `createMockContext` return value SHALL include a `runMiddleware(mw, next?)` helper that executes the supplied middleware against the mock context and returns the terminal result or throws the short-circuit signal.

### Requirement 15: Middleware Registry Introspection

**User Story:** As a framework author, I want to introspect the resolved
middleware chain for a route at bootstrap time, so that I can render dev-only
diagnostics and detect misconfiguration early.

#### Acceptance Criteria

1. THE Middleware_Package SHALL export a `MiddlewareRegistry` service registered under the token `MIDDLEWARE_REGISTRY` from `@stackra/contracts`.
2. THE `MiddlewareRegistry` SHALL expose a `list(): MiddlewareDefinition[]` method that returns every globally registered middleware.
3. THE `MiddlewareRegistry` SHALL expose a `resolve(route: RouteResolutionInput): MiddlewareDefinition[]` method that returns the ordered chain for a specific route, applying Requirements 4, 5, 6, and 9.
4. WHEN `resolve` is called with a route that omits `middleware` and `guards`, THE Middleware_Registry SHALL return the ordered global chain filtered by the route's stage.
5. WHEN `resolve` produces the ordered chain, THE Middleware_Registry SHALL return copies of the definitions with metadata attached under a `resolved` field that includes the effective priority, stage, and inclusion reason (`'global' | 'group' | 'route'`).

### Requirement 16: Parameterized Middleware via Tuples

**User Story:** As an app author, I want to configure a middleware inline with
parameters via a tuple `[middleware, ...params]`, so that reusable middleware
like `rateLimit` can be applied with different limits on different routes.

#### Acceptance Criteria

1. WHEN a route or global list contains a tuple `[middleware, ...params]`, THE Middleware_Resolver SHALL treat the tuple as a parameterized invocation of the referenced middleware.
2. WHEN a tuple-form middleware executes, THE Middleware_Adapter SHALL pass the tuple's `params` to the middleware's `handle` method after `ctx` and `next` (matching the existing `PipeTuple` convention from `@stackra/pipeline`).
3. THE `MiddlewareDefinition` type SHALL allow a fourth generic parameter `TParams extends unknown[]` so that parameterized middleware surface their expected parameter types at call sites.
4. IF a tuple invocation supplies parameters whose types do not match the middleware's declared `TParams`, THEN THE TypeScript_Compiler SHALL raise a type error at the call site.

### Requirement 17: Package Placement and Public API Surface

**User Story:** As a workspace maintainer, I want `defineMiddleware` to live
in a dedicated `@stackra/middleware` package with a stable public API, so that
`@stackra/pipeline`, `@stackra/server`, and `@stackra/ssr` all consume it from
one canonical location.

#### Acceptance Criteria

1. THE Workspace SHALL contain a `@stackra/middleware` package at `middleware/` following the same layout conventions as the existing `@stackra/*` packages (source under `src/`, tests under `__tests__/`, `package.json`, `tsconfig.json`, `tsup.config.ts`, `vitest.config.ts`).
2. THE `@stackra/middleware` package SHALL export from its main entry: `defineMiddleware`, `composeMiddleware`, `toPipe`, `MiddlewareModule`, `MiddlewareRegistry`, `MiddlewareResolver`, the signal helpers (`redirect`, `notFound`, `abort`), the error classes (`MiddlewareExecutionError`, `MiddlewareResolutionError`), the context types (`HttpContext`, `UiContext`, `PipeContext`), and the `MiddlewareDefinition` type.
3. THE `@stackra/middleware` package SHALL declare `@stackra/pipeline`, `@stackra/contracts`, and `@stackra/container` as workspace dependencies.
4. THE `@stackra/middleware` package SHALL expose a `/testing` subpath entry exporting `createMockContext` and `runMiddleware` so that consumers can import test helpers without pulling in runtime code.
5. THE `@stackra/server` package SHALL import `defineMiddleware`, `HttpContext`, and `MiddlewareRegistry` from `@stackra/middleware` and SHALL NOT re-declare equivalent primitives.
6. THE `@stackra/ssr` package SHALL import `defineMiddleware`, `UiContext`, and `MiddlewareRegistry` from `@stackra/middleware` and SHALL NOT re-declare equivalent primitives.

### Requirement 18: Correctness Properties Across the Middleware Chain

**User Story:** As a platform author, I want the middleware runtime to
guarantee well-defined behavior around state propagation, ordering, and
short-circuits, so that I can reason about composition without reading the
runtime source.

#### Acceptance Criteria

1. WHEN a middleware calls `next(ctx')` with a modified context, THE Middleware_Runtime SHALL invoke the next middleware in the chain with a context whose `state` reflects every mutation supplied to `next`.
2. WHEN a middleware calls `next()` without arguments, THE Middleware_Runtime SHALL invoke the next middleware with the current `ctx` value (state mutations performed on `ctx.state` before the call are preserved).
3. WHEN the middleware chain contains `[A, B, C]` and every middleware calls `next()` without short-circuiting, THE Middleware_Runtime SHALL invoke `A`, then `B`, then `C`, then the destination, in that order exactly once each.
4. WHEN `B` short-circuits via `redirect`, `notFound`, or `abort`, THE Middleware_Runtime SHALL invoke `A` and `B` but SHALL NOT invoke `C` or the destination.
5. FOR ALL middleware chains where every middleware calls `next()` exactly once and the destination is a pure function, the terminal result of the chain SHALL equal the destination applied to the final context, regardless of the order in which independent middleware are added to the definition list (round-trip property between definition-order and resolved-order under equal priorities and no ordering constraints).
6. FOR ALL parseable route definitions, `MiddlewareRegistry.resolve(route)` applied twice with the same input SHALL produce structurally equal ordered chains (idempotence of resolution).
7. WHEN two chains `[A, B]` and `[A]` are executed against the same initial state and `B` does not mutate state before `next()`, THE Middleware_Runtime SHALL produce the same state at the destination invocation for both chains (metamorphic property: pure prefix additions do not change downstream state).

### Requirement 19: Naming, Anonymous vs Named Middleware

**User Story:** As an app author, I want anonymous middleware to be legal for
one-off route hooks and named middleware for globally addressable behavior, so
that the primitive stays lightweight for small cases without giving up
introspection for large ones.

#### Acceptance Criteria

1. THE `MiddlewareDefinition.name` field SHALL be optional and SHALL be typed as `string | undefined`.
2. WHEN an anonymous middleware is registered globally, THE Middleware_Registry SHALL accept the definition but SHALL NOT make it addressable by name.
3. IF a `dependsOn`, `runsBefore`, `runsAfter`, or per-route string reference points to an anonymous middleware, THEN THE Middleware_Resolver SHALL raise a `MiddlewareResolutionError` with code `MIDDLEWARE_UNKNOWN_REFERENCE`.
4. WHEN two named middleware share the same `name` in the same registry, THE Middleware_Registry SHALL treat the later registration as a replacement of the earlier one and SHALL emit a warning via the DI-resolved logger.

### Requirement 20: Comprehensive Test Coverage

**User Story:** As a maintainer, I want unit, feature, and property-based tests
covering the middleware primitive and its runtime, so that regressions are
caught before deployment.

#### Acceptance Criteria

1. GIVEN the `defineMiddleware` primitive, WHEN unit-tested, THE Test_Suite SHALL verify each overload (function, options-with-handle, options-with-resolve) produces a `MiddlewareDefinition` with the correct shape and inferred generics.
2. GIVEN the `MiddlewareResolver`, WHEN unit-tested, THE Test_Suite SHALL verify priority ordering, dependency resolution, cycle detection, unknown-reference detection, `runOn` filtering, and `enabled` handling.
3. GIVEN the pipeline adapter `toPipe`, WHEN unit-tested, THE Test_Suite SHALL verify function, class, and tuple middleware execute correctly against the real `@stackra/pipeline` runtime.
4. GIVEN the short-circuit signals, WHEN unit-tested, THE Test_Suite SHALL verify `redirect`, `notFound`, and `abort` produce the specified stage-appropriate results and abort the chain per Requirement 11.
5. GIVEN the type-level state chaining, WHEN tested via `expectType` assertions, THE Test_Suite SHALL verify Requirement 3's inference behavior across two- and three-middleware compositions.
6. GIVEN the correctness properties in Requirement 18, WHEN property-based tested with fast-check, THE Test_Suite SHALL verify each property against randomly generated middleware chains of length 0 to 10.
7. GIVEN the `MiddlewareModule`, WHEN feature-tested with a real DI container, THE Test_Suite SHALL verify `forRoot` bootstrap, per-route resolution, and end-to-end execution against a simulated HTTP route and a simulated UI route.

### Requirement 21: Built-In Middleware Packaging

**User Story:** As an app author, I want the framework to ship a set of common
middleware (authentication, rate limiting, CORS, CSP, body parsing, request
validation, logging, tracing) so that I do not have to implement each one from
scratch, while keeping the core primitive lean.

#### Acceptance Criteria

1. THE `@stackra/middleware` package SHALL contain the primitive (`defineMiddleware`), the runtime (`MiddlewareRegistry`, `MiddlewareResolver`, `toPipe`), the signal helpers, and the test harness, and SHALL NOT contain any concrete built-in middleware implementation.
2. THE `@stackra/server` package SHALL contain HTTP-stage built-in middleware for authentication, rate limiting, CORS, CSP, body parsing, request validation, logging, and tracing.
3. THE `@stackra/ssr` package SHALL contain UI-stage built-in middleware for session hydration, feature flag evaluation, and navigation guards.
4. THE Server_Package SHALL export each built-in HTTP middleware as a named `MiddlewareDefinition` produced by `defineMiddleware`, so that consumers can compose it in `defineApiRoutes` or register it globally without a wrapping factory.
5. WHERE a built-in middleware requires configuration, THE Server_Package SHALL expose the configuration as parameters accepted via the tuple form `[middleware, options]` (Requirement 16) and SHALL type the `options` argument.
6. THE Server_Package SHALL provide a named middleware group `'@web'` combining `bodyParser`, `logging`, and `tracing` in a documented order.
7. THE Server_Package SHALL provide a named middleware group `'@api'` combining `bodyParser`, `cors`, `rateLimit`, `logging`, and `tracing` in a documented order.
8. IF a consumer imports a built-in middleware directly from `@stackra/middleware`, THEN THE Middleware_Package SHALL NOT resolve the import (the built-ins live in `@stackra/server` or `@stackra/ssr` per Requirements 21.2 and 21.3).

### Requirement 22: Runtime Neutrality and Framework Boundaries

**User Story:** As a workspace maintainer, I want the middleware primitive and
its runtime to have no hard dependency on any HTTP or UI runtime, so that
adapters for different runtimes can be added without changing the core.

#### Acceptance Criteria

1. THE `@stackra/middleware` package SHALL declare workspace dependencies only on `@stackra/pipeline`, `@stackra/contracts`, and `@stackra/container`.
2. THE `@stackra/middleware` package source SHALL contain no import from `@nestjs/*`, `express`, `fastify`, `next`, or any other concrete HTTP or UI runtime.
3. WHERE a runtime-specific behavior is required (for example, translating a `redirect` signal into a `Response` object), THE Server_Package or Ssr_Package SHALL provide the adapter and register it via DI so that `@stackra/middleware` remains runtime-agnostic.
4. THE `@stackra/middleware` package SHALL run in both server (Node, Bun, Deno, Edge) and browser environments, and its published bundle SHALL contain no server-only or browser-only imports at the top level.
5. WHEN `@stackra/middleware` is imported into a browser bundle, THE Bundler SHALL be able to tree-shake every symbol not used by the consumer, including all short-circuit helpers and the resolver, because the package `sideEffects` field is set to `false`.
