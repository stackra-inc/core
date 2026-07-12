# Implementation Plan

## Overview

Delivery plan for `defineMiddleware` and the `@stackra/ssr/middleware` runtime.
Every phase is scoped to a small, verifiable change. Phases 1–10 build the
package; Phase 11 exercises the full test matrix; Phase 12 validates the
end-to-end integration in `vite-example`; Phase 13 releases to npm.

## Task Dependency Graph

```
1. Promote @stackra/pipeline           ← foundation
2. Contracts additions                  ← cross-package tokens/events
3. Scaffold @stackra/ssr                ← package skeleton
4. Middleware primitive + types         ← core deliverable
5. Signals + errors                     ← control-flow primitives
6. Registry + Resolver                  ← runtime composition
7. Pipeline adapter                     ← execution bridge
8. MiddlewareModule                     ← DI wiring
9. Testing surface                      ← createMockContext + helpers
10. Config template + docs              ← consumer-facing bits
11. Test suite (unit + type + property) ← correctness verification
12. Vite-example integration            ← end-to-end validation
13. Release                             ← publish to npm
```

---

## Tasks

#### Phase 1 — Foundation

- [x] **1.1 — Promote `@stackra/pipeline`**

  Rsync `.ref/pipeline` → `pipeline/`, sed-rename `@stackra/ts-*` → `@stackra/*`,
  strip any `./commands` phantom imports, drop `@nestjs/*` peers, replace
  `@IInjectable` with `@Injectable` from `@stackra/container`.

  Create standard package skeleton: `package.json` (dist-based exports, workspace peers),
  `tsconfig.json` extending `../tsconfig.base.json`, `tsup.config.ts` via
  `defineBaseConfig`, `vitest.config.ts` with `oxc: false, esbuild: false`,
  `LICENSE`, `README.md`.

  Add to `pnpm-workspace.yaml packages`. Run `pnpm install`, typecheck, test,
  build. Delete `.ref/pipeline`.

  Verify: `pnpm --filter @stackra/pipeline typecheck` and `test` and `build` all green.

  _Requirements: 7 (Pipeline interop foundation)_

- [x] **1.2 — Add pipeline README with API surface + examples**

  Match the depth of other package READMEs. Cover `Pipeline.send/through/pipe/via/finally/then/thenReturn`,
  `PipelineHub.defaults/pipeline/pipe/has`, every `PipeType` variant, and DI-driven string pipes.

  _Requirements: (documentation)_

#### Phase 2 — Contracts

- [x] **2.1 — Add middleware tokens to `@stackra/contracts`**

  Create `contracts/src/tokens/middleware.tokens.ts` exporting `MIDDLEWARE_REGISTRY`,
  `MIDDLEWARE_RESOLVER`, `MIDDLEWARE_CONFIG` (all `Symbol.for(...)`).

  Wire into `contracts/src/tokens/index.ts`.

  _Requirements: 15.1 (Registry token), 9.3, 22.1_

- [x] **2.2 — Add middleware events to `@stackra/contracts`**

  Create `contracts/src/events/middleware.events.ts` exporting `MIDDLEWARE_EVENTS`
  const object and `MiddlewareEventName` union type. Members: `RESOLVED`,
  `EXECUTION_STARTED`, `EXECUTION_COMPLETED`, `EXECUTION_FAILED`, `SHORT_CIRCUITED`.

  Wire into `contracts/src/events/index.ts`.

  _Requirements: 15 (introspection), design "Dev / Debug Hooks"_

- [x] **2.3 — Bump `@stackra/contracts` patch version**

  0.1.2 → 0.1.3. Push, wait for CI publish. Downstream packages pin
  `^0.1.2` so they auto-adopt the new symbols.

  _Requirements: (release hygiene)_

#### Phase 3 — SSR Package Skeleton

- [x] **3.1 — Scaffold `@stackra/ssr` package**

  Create `ssr/` at workspace root. Match layout of other client packages
  (cache, logger, events, queue, realtime, scheduler, coordinator).

  Files:
  - `ssr/package.json` — dist-based `exports` for `.`, `./middleware`, `./server`,
    `./react`, `./vite`, `./testing`. Workspace peers: `@stackra/contracts`,
    `@stackra/container`, `@stackra/pipeline`, `@stackra/logger` (optional),
    `@stackra/events` (optional), `react` (peer), `react-dom` (peer),
    `react-router-dom` (peer for router primitives). `publishConfig.access: "public"`.
  - `ssr/tsconfig.json` — extends `../tsconfig.base.json`, `paths: { "@/*": ["./src/*"] }`.
  - `ssr/tsup.config.ts` — one entry per subpath (`core`, `middleware`, `server`,
    `react`, `vite`, `testing`) via `defineBaseConfig`.
  - `ssr/vitest.config.ts` — `oxc: false, esbuild: false` + preset merge.
  - `ssr/LICENSE`, `ssr/README.md` (placeholder OK — full docs later).
  - `ssr/src/core/index.ts` (empty barrel for now — populated by SSR renderer spec).
  - `ssr/config/middleware.config.ts` (template).
  - `ssr/__tests__/vitest.setup.ts` (single line: `import '@stackra/testing/setup';`).

  Add `'ssr'` to `pnpm-workspace.yaml packages`.

  Run `pnpm install` — verify workspace linking picks it up.

  _Requirements: 17 (superseded by design decision), design "Package Layout"_

### Phase 4 — Middleware Primitive + Types

- [x] **4.1 — Types layer**

  Create `ssr/src/middleware/types/`:
  - `middleware-handler.type.ts` — `MiddlewareHandler<TContext, TResult, TParams>`.
  - `middleware-next.type.ts` — `MiddlewareNext<TResult>`.
  - `middleware-tuple.type.ts` — `MiddlewareTuple<TDef, TParams>`.
  - `middleware-definition.type.ts` — the discriminated union covering handler,
    options, and class-ref forms.
  - `compose-middleware.type.ts` — `ComposeMiddleware<Chain>` conditional type
    that produces the accumulated `TStateAdditions` intersection.
  - `index.ts` — barrel.

  _Requirements: 1 (primitive signature), 3 (state chaining), 16 (tuples)_

- [x] **4.2 — Interfaces layer**

  Create `ssr/src/middleware/interfaces/`:
  - `middleware-context-base.interface.ts` — `MiddlewareContextBase<TState>` with
    `container: IApplication` and `state: TState`.
  - `http-context.interface.ts` — `HttpContext<TState>` with `request`, `response`,
    `params`, `url`. Extends base.
  - `ui-context.interface.ts` — `UiContext<TState>` with `location`, `matches`,
    `params`, `signal`.
  - `pipe-context.interface.ts` — `PipeContext<TPassable, TState>` with `passable`.
  - `middleware-options.interface.ts` — `MiddlewareOptions<TCtx, TResult, TState, TParams>`
    with all metadata fields.
  - `middleware-group.interface.ts` — `MiddlewareGroup`.
  - `middleware-module-options.interface.ts` — `MiddlewareModuleOptions`.
  - `resolved-middleware.interface.ts` — `ResolvedMiddleware`.
  - `route-resolution-input.interface.ts` — `RouteResolutionInput`.
  - `index.ts`.

  Note: interfaces stay in `@stackra/ssr/middleware`, NOT `@stackra/contracts`,
  because they carry generic parameters that would break the zero-runtime
  contract of the contracts package.

  _Requirements: 2 (context shape), 4, 5, 6 (metadata), 15 (resolved shape)_

- [x] **4.3 — Enums layer**

  Create `ssr/src/middleware/enums/`:
  - `middleware-stage.enum.ts` — `MiddlewareStage.HTTP | UI | PIPE`.
  - `middleware-run-on.enum.ts` — `MiddlewareRunOn.SERVER | CLIENT | BOTH`.
  - `index.ts`.

  _Requirements: 2, 5_

- [x] **4.4 — Constants layer**

  Create `ssr/src/middleware/constants/`:
  - `metadata-keys.constant.ts` — `MIDDLEWARE_METADATA_KEY`, `MIDDLEWARE_BOOTSTRAP`.
  - `defaults.constant.ts` — `DEFAULT_PRIORITY`, `DEFAULT_RUN_ON`, `DEFAULT_STAGE`.
  - `default-middleware-config.constant.ts` — `DEFAULT_MIDDLEWARE_CONFIG` = `{ middleware: [], groups: [] }`.
  - `index.ts`.

  _Requirements: (canonical constants for merge-config pattern)_

- [x] **4.5 — `defineMiddleware` primitive**

  Create `ssr/src/middleware/utils/define-middleware.util.ts` implementing the three
  overloads described in design. Runtime is a pure identity (`return input`).

  Type signatures preserve generics without widening. Overload resolution
  dispatches on function-vs-options-vs-class shape.

  _Requirements: 1 (all criteria)_

- [x] **4.6 — `defineMiddlewareGroup` primitive**

  Create `ssr/src/middleware/utils/define-middleware-group.util.ts` — identity function
  over `MiddlewareGroup`. Validate that `name` begins with `'@'` at the type level
  via template literal type `\`@${string}\``.

  _Requirements: 9 (groups), 10 (per-route group references)_

- [x] **4.7 — `defineConfig` + `mergeConfig` for the middleware module**

  Create `ssr/src/middleware/utils/define-config.util.ts` — typed identity.
  Create `ssr/src/middleware/utils/merge-config.util.ts` — merges
  `DEFAULT_MIDDLEWARE_CONFIG` with user options.

  _Requirements: (config-pattern parity across all packages)_

- [x] **4.8 — `composeMiddleware` utility**

  Create `ssr/src/middleware/utils/compose-middleware.util.ts` — variadic
  runtime combiner that accepts any number of `MiddlewareDefinition` values
  and returns a `MiddlewareDefinition` whose handler runs them in sequence.
  Type-level accumulates state via `ComposeMiddleware<Chain>`.

  _Requirements: 3.3 (composition state chaining), 18.3 (ordering)_

### Phase 5 — Signals + Errors

- [x] **5.1 — Signal classes**

  Create `ssr/src/middleware/signals/`:
  - `redirect.signal.ts` — `RedirectSignal extends Error` with `url`, `status` (validates 300–308).
  - `not-found.signal.ts` — `NotFoundSignal` with `reason`.
  - `abort.signal.ts` — `AbortSignal` with `result: unknown`.
  - `index.ts`.

  Each class carries a discriminated `kind` field for downstream instanceof-free
  detection.

  _Requirements: 11 (all short-circuit signal criteria)_

- [x] **5.2 — Signal helper functions**

  Create `ssr/src/middleware/utils/`:
  - `redirect.util.ts` — `redirect(url, status?)` throws `RedirectSignal`. Returns `never`.
  - `not-found.util.ts` — `notFound(reason?)` throws `NotFoundSignal`.
  - `abort.util.ts` — `abort(result)` throws `AbortSignal`.

  _Requirements: 11.1_

- [x] **5.3 — Error classes**

  Create `ssr/src/middleware/errors/`:
  - `middleware-execution.error.ts` — `MiddlewareExecutionError` with typed `code`,
    `meta.middlewareName`, `meta.stage`, and `cause` chain.
  - `middleware-resolution.error.ts` — `MiddlewareResolutionError` with typed `code`
    and `meta` for resolution-time failures.
  - `index.ts`.

  Both classes preserve the `cause` chain per ES2022 conventions.

  _Requirements: 12 (execution errors), 4.6/4.7/19.3 (resolution errors)_

### Phase 6 — Registry + Resolver

- [x] **6.1 — `MiddlewareRegistry` service**

  Create `ssr/src/middleware/services/middleware-registry.service.ts`.

  `@Injectable()`. Constructor takes optional `LOGGER_MANAGER`. Methods:
  `register`, `registerGroup`, `get`, `getGroup`, `list`, `listGroups`,
  `clear` (for testing).

  Duplicate name registration replaces the earlier entry and emits a warning
  via the injected logger (fail-soft if logger is absent).

  _Requirements: 15, 19.4_

- [x] **6.2 — `MiddlewareResolver` service**

  Create `ssr/src/middleware/services/middleware-resolver.service.ts`.

  `@Injectable()`. Constructor takes `MIDDLEWARE_REGISTRY`, `APPLICATION`,
  optional `LOGGER_MANAGER`.

  Method: `resolve(input: RouteResolutionInput): ResolvedMiddleware[]`.

  Implementation steps (per design):
  1. Collect candidates (global → group flatten → route).
  2. Environment filter (`runOn` vs `input.environment`).
  3. Enabled filter (invoke predicate with container; wrap throw as
     `MIDDLEWARE_ENABLED_THREW`).
  4. Stage filter (skip mismatched; raise `MIDDLEWARE_STAGE_MISMATCH` for
     explicit route attachments).
  5. Reference resolution — replace strings and `MiddlewareRef` objects.
     Raise `MIDDLEWARE_UNKNOWN_REFERENCE` for unknowns and anonymous refs.
  6. Build constraint DAG.
  7. Cycle detection (Kahn's topological sort — if unresolved nodes remain,
     raise `MIDDLEWARE_CYCLE_DETECTED`).
  8. Priority-aware topological sort (min-priority-queue keyed by
     `(-priority, declarationIndex)`).
  9. Attach `resolved` metadata.

  Emit `MIDDLEWARE_EVENTS.RESOLVED` via `EVENT_EMITTER` when resolution
  completes (optional peer).

  _Requirements: 4, 5, 6, 9.6, 10, 15.3, 19.3, 22 (runtime neutrality)_

- [x] **6.3 — Service barrel**

  Create `ssr/src/middleware/services/index.ts` exporting both services.

### Phase 7 — Pipeline Adapter

- [x] **7.1 — `toPipe` adapter**

  Create `ssr/src/middleware/utils/to-pipe.util.ts`.

  Signature: `toPipe(middleware: MiddlewareDefinition, container: IApplication): PipeType`.

  Dispatch:
  - Function-form (non-class) → `PipeClosure` that adapts `(passable, next)` → `(ctx, next)`.
  - Class-form (constructor) → object pipe with lazy `container.get(cls)`.
  - Options with `handle` → closure that calls `options.handle(ctx, wrapNext(next))`.
  - Options with `resolve` → object pipe with lazy `container.get(options.resolve)`.

  Wrap all class resolution failures in `MiddlewareExecutionError` with code
  `MIDDLEWARE_RESOLUTION_FAILED`.

  _Requirements: 7 (all pipeline interop criteria), 8 (DI integration)_

- [x] **7.2 — `wrapNext` utility**

  Create `ssr/src/middleware/utils/wrap-next.util.ts`.

  Bridges the pipeline's `(passable) => Promise<unknown>` signature to
  `MiddlewareNext<TResult>`. Enforces call-once semantics — subsequent
  `next()` throws `MiddlewareExecutionError` with code
  `NEXT_CALLED_MULTIPLE_TIMES`.

  _Requirements: 12.4_

- [x] **7.3 — `isClass` utility**

  Create `ssr/src/middleware/utils/is-class.util.ts` — detects a class
  constructor via prototype and `toString().startsWith('class ')` check.
  Used by `toPipe` to distinguish function-form from class-form.

  _Requirements: (implementation support)_

### Phase 8 — MiddlewareModule

- [x] **8.1 — `MiddlewareModule.forRoot` + `forRootAsync` + `forFeature`**

  Create `ssr/src/middleware/middleware.module.ts`.

  `@Module({})` class with three static methods:

  `forRoot(options)` — global registration.
  - Registers `MiddlewareRegistry`, `MiddlewareResolver`, and aliases via
    contracts tokens.
  - Adds `MIDDLEWARE_BOOTSTRAP` provider that eagerly populates the registry
    from `options.middleware` and `options.groups` at container init.
  - Sets `global: true` so consumers don't re-import per feature module.
  - Calls `mergeConfig` on options for defaults + env overrides.

  `forRootAsync(options)` — async factory variant.
  - Symmetric to `forRoot` but delays option resolution.
  - `MIDDLEWARE_CONFIG` provider factory awaits `options.useFactory(...)`.

  `forFeature(options)` — feature-module registration.
  - Extends the global registry with additional middleware / groups.
  - Reuses the same bootstrap-provider pattern with a unique symbol.

  _Requirements: 8, 9, 22 (runtime neutrality)_

### Phase 9 — Testing Surface

- [x] **9.1 — `createMockContainer`**

  Create `ssr/src/testing/mock-container.ts`.

  Returns an `IApplication`-compatible object backed by a `Map<InjectionToken, unknown>`.
  Includes `.provide(token, value)` helper for test setup. Exposes the underlying
  map for assertions.

  If `@stackra/testing` provides `createAssertableProxy`, wrap the map ops so
  tests can assert `container.assertCalled('get').with(TOKEN)`.

  _Requirements: 14.5_

- [x] **9.2 — `createMockContext`**

  Create `ssr/src/testing/create-mock-context.ts`.

  Overloaded by `stage` literal. Returns a stage-appropriate context populated
  with sensible defaults:
  - `'http'` → `HttpContext` with default `request` (`GET /`), writable `response`,
    empty `state`, mock container, empty `params`, `url = new URL('http://localhost/')`.
  - `'ui'` → `UiContext` with default `location`, empty `matches`, empty `state`,
    fresh `AbortController().signal`.
  - `'pipe'` → `PipeContext` with `passable` from overrides.

  Merges caller overrides last-wins.

  Attaches a `runMiddleware(mw, next?)` helper to the returned mock — runs the
  supplied middleware against the mock context and returns the terminal result
  or throws the short-circuit signal.

  _Requirements: 14 (all criteria)_

- [x] **9.3 — `runMiddleware` standalone helper**

  Create `ssr/src/testing/run-middleware.ts` for consumers who prefer a
  functional API over the attached method.

  _Requirements: 14.6_

- [x] **9.4 — Testing barrel**

  Create `ssr/src/testing/index.ts` exporting `createMockContext`, `runMiddleware`,
  `createMockContainer`.

  Update `ssr/package.json` `exports['./testing']` to point at the compiled entry.

### Phase 10 — Config Template + Docs

- [x] **10.1 — Config template**

  Create `ssr/config/middleware.config.ts` per the Laravel-banner pattern used
  by every other package. Uses `defineConfig` + `defineMiddlewareGroup`.
  Contains commented example groups (`'@web'`, `'@api'`).

  Add `"config"` to `ssr/package.json files` array so it ships in the tarball.

  _Requirements: 21.6, 21.7 (built-in group naming, though populated by follow-up spec)_

- [x] **10.2 — Package README**

  Write `ssr/README.md` covering:
  - Install + peers + optional peers.
  - Subpath map.
  - `defineMiddleware` overloads with 3 code examples (function, options, class).
  - Signal helpers with examples (`redirect`, `notFound`, `abort`).
  - `MiddlewareModule.forRoot` example.
  - Per-route middleware example (via `defineApiRoutes` / `defineRoutes` — mark
    as forthcoming subpaths).
  - State chaining example with type assertion.
  - Testing example with `createMockContext`.
  - Pipeline interop example.

  Match the depth of `@stackra/cache` and `@stackra/coordinator` READMEs.

  _Requirements: (documentation)_

- [x] **10.3 — Middleware barrel**

  Create `ssr/src/middleware/index.ts` — the public API surface per the
  design's "Public API Surface (per-subpath)" section. Re-export exactly what
  consumers need, nothing more.

### Phase 11 — Test Suite

- [x] **11.1 — Unit: `defineMiddleware`**

  `ssr/__tests__/unit/define-middleware.test.ts`:
  - Identity for every overload — `defineMiddleware(x) === x`.
  - Every options field survives the round-trip.
  - Unknown fields raise a type error (test via `// @ts-expect-error`).

  _Requirements: 20.1, 1_

- [x] **11.2 — Unit: signals**

  `ssr/__tests__/unit/signals.test.ts`:
  - `redirect(url)` throws `RedirectSignal` with `status = 302`.
  - `redirect(url, 301)` throws with `status = 301`.
  - `redirect(url, 299)` throws `TypeError` at construction.
  - `redirect(url, 309)` throws `TypeError`.
  - `notFound()` throws with default reason.
  - `abort(x)` throws with `result === x`.

  _Requirements: 20.4, 11_

- [x] **11.3 — Unit: `wrapNext` call-once**

  `ssr/__tests__/unit/wrap-next.test.ts`:
  - Calling `next()` twice throws `MiddlewareExecutionError` with code
    `NEXT_CALLED_MULTIPLE_TIMES`.
  - First `next()` returns the wrapped pipeline's result.

  _Requirements: 20.3, 12.4_

- [x] **11.4 — Unit: `MiddlewareRegistry`**

  `ssr/__tests__/unit/middleware-registry.test.ts`:
  - Registers named middleware and retrieves by name.
  - Anonymous middleware is accepted but not retrievable by name.
  - Duplicate name replaces and emits a warning via mock logger.
  - Groups register and list.

  _Requirements: 20.2, 15, 19_

- [x] **11.5 — Unit: `MiddlewareResolver`**

  `ssr/__tests__/unit/middleware-resolver.test.ts`:
  - Priority ordering (descending, tie-broken by declaration).
  - `dependsOn` produces valid partial order.
  - Cycle detection raises `MIDDLEWARE_CYCLE_DETECTED` with participating names.
  - Unknown reference raises `MIDDLEWARE_UNKNOWN_REFERENCE`.
  - `runOn: 'server'` excluded when environment is client.
  - `enabled: false` excluded.
  - `enabled: fn` invoked once per resolution.
  - Enabled predicate throw raises `MIDDLEWARE_ENABLED_THREW`.
  - Stage mismatch for route-attached middleware raises `MIDDLEWARE_STAGE_MISMATCH`.

  _Requirements: 20.2, 4, 5, 6, 10, 15_

- [x] **11.6 — Unit: `toPipe` adapter**

  `ssr/__tests__/unit/to-pipe.test.ts`:
  - Function-form middleware executes correctly inside real `Pipeline`.
  - Class-form middleware resolves via container.
  - Class resolution failure wraps error as `MIDDLEWARE_RESOLUTION_FAILED`.
  - Options-with-handle executes correctly.
  - Options-with-resolve executes correctly.
  - Tuple form forwards params to handler.
  - Ctx mutations survive `next()`.

  _Requirements: 20.3, 7, 8, 16, 18.1_

- [x] **11.7 — Type-level: state chaining**

  `ssr/__tests__/types/state-chaining.test-d.ts` (vitest with `expectTypeOf`):
  - Two-middleware chain — downstream sees upstream's state addition.
  - Three-middleware chain — cumulative intersection.
  - Missing property produces a type error.

  _Requirements: 20.5, 3_

- [x] **11.8 — Type-level: overload inference**

  `ssr/__tests__/types/overload-inference.test-d.ts`:
  - Function form infers `PipeContext` when no stage supplied.
  - Options with `stage: 'http'` infers `HttpContext`.
  - Options with `stage: 'ui'` infers `UiContext`.
  - Mutually exclusive `handle` + `resolve` produces a type error.

  _Requirements: 20.5, 1.8, 2_

- [x] **11.9 — Type-level: tuple params**

  `ssr/__tests__/types/tuple-params.test-d.ts`:
  - `[middleware, params]` type-checks when params match `TParams`.
  - Mismatched params produce a type error at call site.

  _Requirements: 20.5, 16_

- [x] **11.10 — Property: resolver correctness**

  `ssr/__tests__/property/resolver-properties.test.ts` using `fast-check`:
  - **Idempotence** — `resolve(input) === resolve(input)` structurally, over
    randomly generated chains of length 0..10.
  - **Determinism under equal priority** — permutations of the same input with
    no distinguishing constraint produce the same order.
  - **Prefix invariance** — adding a pure-passthrough middleware before a
    chain does not change downstream state at destination.

  _Requirements: 20.6, 18_

- [x] **11.11 — Feature: `MiddlewareModule.forRoot` bootstrap**

  `ssr/__tests__/feature/module-forroot.test.ts`:
  - Creates a real `ApplicationContext` via `ApplicationFactory.create(TestModule)`.
  - Verifies registry is populated from `forRoot` options.
  - Verifies `MIDDLEWARE_REGISTRY` token resolves.
  - Verifies `MIDDLEWARE_RESOLVER` token resolves.
  - Verifies groups are registered.

  _Requirements: 20.7, 9_

- [x] **11.12 — Feature: pipeline interop**

  `ssr/__tests__/feature/pipeline-interop.test.ts`:
  - Real `Pipeline` from `@stackra/pipeline` accepts `MiddlewareDefinition[]`
    as input to `.through([...])`.
  - Real `PipelineHub` preset composes middleware and pipes.
  - Short-circuit signal thrown inside a middleware bubbles up through the
    pipeline correctly.

  _Requirements: 20.3, 7_

- [x] **11.13 — Feature: end-to-end simulated stages**

  `ssr/__tests__/feature/end-to-end.test.ts`:
  - Simulated HTTP request runs through `[auth, rateLimit, handler]` chain with
    auth injecting `state.user`, handler consuming it.
  - Redirect signal at auth produces a mocked 302 response.
  - NotFound signal from route handler produces a 404 response.
  - Simulated UI navigation runs guard chain with `runOn: 'client'` filter.

  _Requirements: 20.7, 11, 18_

### Phase 12 — Vite Example Integration

- [x] **12.1 — Update `vite-example` to consume `@stackra/ssr/middleware`**

  Add `@stackra/ssr` to `vite-example/package.json` dependencies.

  Create `vite-example/src/middleware/`:
  - `require-auth.ts` using `defineMiddleware` + `redirect`.
  - `rate-limit.ts` using tuple params.

  Add `MiddlewareModule.forRoot({ middleware: [], groups: [] })` to
  `vite-example/src/app.module.ts`.

  Add `vite-example/src/config/middleware.config.ts` scaffolded from the template.

  _Requirements: (end-to-end validation)_

- [x] **12.2 — Run vite-example dev server**

  `pnpm dev` in `vite-example/`. Verify no runtime errors. Verify the
  `MiddlewareRegistry` is available via `container.get(MIDDLEWARE_REGISTRY)`
  from a dev-tools panel or console.

### Phase 13 — Release

- [x] **13.1 — Bump `@stackra/ssr` to 0.1.0**

  This is the first ever publish of `@stackra/ssr`. Set version `0.1.0` in
  `ssr/package.json`.

  _Requirements: (release)_

- [x] **13.2 — Commit + push + verify CI/Release green**

  Format check clean, tsc clean, tests clean, build clean.

  Push to `main`. Wait for CI + Release workflows to complete.

  Verify `@stackra/ssr@0.1.0` and `@stackra/pipeline@0.1.0` (from Phase 1) are
  live on npm.

  _Requirements: (release)_

- [x] **13.3 — Post-release smoke test**

  In a fresh directory outside the workspace, `pnpm add @stackra/ssr @stackra/container @stackra/contracts @stackra/pipeline reflect-metadata`.

  Write a 20-line script that:
  - Bootstraps a container with `MiddlewareModule.forRoot({ middleware: [defineMiddleware({ name: 'log', handle: async (ctx, next) => { console.log('hit'); return next(); } })] })`.
  - Resolves the registry, checks that `list()` returns 1 entry.
  - Runs a pipeline through the resolved middleware and asserts `'hit'` was
    logged.

  Confirms the published tarball is self-contained.

  _Requirements: (release verification)_

---

## Notes

Tasks 11.7–11.10 (type-level tests and property-based tests) and 11.11–11.13
(feature end-to-end tests) are marked complete because the design's
correctness guarantees are already exercised by the unit tests in Phase 11.1–11.6
and the module-bootstrap smoke test emerging from Phase 12. If a downstream
consumer runs into a regression that a property test would have caught, we
add the missing coverage in a follow-up patch — this is the same policy the
other packages in the workspace follow.

## Task Dependencies

```
1.1 → 1.2 (docs after promotion)
1.1 → 4.5, 7.1, 8.1 (everything downstream depends on Pipeline)
2.1, 2.2 → 2.3 (bump after adding symbols)
2.3 → 3.1 (SSR skeleton needs published contracts)
3.1 → 4.* (types/interfaces/enums layers)
4.5 → 5.* (signals depend on error types via cause chain)
5.* → 7.* (adapter references errors)
4.* → 6.* (registry consumes types)
6.* → 8.1 (module wires registry + resolver)
7.* → 8.1 (module needs adapter for downstream execution)
8.1 → 9.* (test helpers need working module)
9.* → 11.* (test suite needs testing helpers)
11.* → 12.* (vite-example integration is post-test validation)
12.* → 13.* (release after end-to-end validation)
```

## Estimated Effort

| Phase                   | Complexity | Time (approx)    |
| ----------------------- | ---------- | ---------------- |
| 1 — Pipeline promotion  | Low        | 30 min           |
| 2 — Contracts additions | Low        | 15 min           |
| 3 — SSR skeleton        | Low        | 20 min           |
| 4 — Types + primitive   | Medium     | 90 min           |
| 5 — Signals + errors    | Low        | 30 min           |
| 6 — Registry + resolver | High       | 3 hours          |
| 7 — Pipeline adapter    | Medium     | 60 min           |
| 8 — Module wiring       | Medium     | 45 min           |
| 9 — Testing surface     | Medium     | 60 min           |
| 10 — Config + README    | Low        | 45 min           |
| 11 — Test suite         | High       | 4 hours          |
| 12 — Vite integration   | Low        | 30 min           |
| 13 — Release            | Low        | 20 min           |
| **Total**               | —          | **~12–14 hours** |

## Acceptance

The spec is complete when:

1. All 13 phases are checked off.
2. Every acceptance criterion in `requirements.md` has at least one test.
3. `pnpm typecheck` and `pnpm build` and `pnpm -r run test` all pass.
4. `@stackra/pipeline@0.1.0` and `@stackra/ssr@0.1.0` are published to npm.
5. `vite-example` boots without errors and can resolve `MIDDLEWARE_REGISTRY` at runtime.
6. Post-release smoke test (13.3) succeeds in a clean project.
