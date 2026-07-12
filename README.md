# @stackra/core

pnpm monorepo containing the Stackra foundation packages.

## Packages

| Package              | Path         | Description                                                                          |
| -------------------- | ------------ | ------------------------------------------------------------------------------------ |
| `@stackra/container` | `container/` | NestJS-compatible DI container (core + React bindings + NestJS bridge)               |
| `@stackra/contracts` | `contracts/` | Shared DI tokens, interfaces, types, and enums — zero runtime                        |
| `@stackra/events`    | `events/`    | Cross-platform event bus with typed emitters and discovery-based `@OnEvent` handlers |
| `@stackra/logger`    | `logger/`    | Cross-platform logger with pluggable reporters, enrichers, and formatters            |
| `@stackra/support`   | `support/`   | Utility layer — Str, Arr, Num, Env, Pipeline, Fluent, Uri, BaseRegistry, Manager     |
| `@stackra/testing`   | `testing/`   | Vitest preset (SWC transform) + setup lifecycle + assertable primitives              |

## Requirements

- Node **>= 22**
- pnpm **>= 10**

## Setup

```bash
pnpm install
```

## Scripts

```bash
pnpm typecheck        # tsc --noEmit across every package
pnpm test             # build then vitest run
pnpm test:watch       # vitest watch mode
pnpm test:coverage    # coverage report
pnpm build            # tsup builds every package to dist/
pnpm dev              # tsup --watch across every package (parallel)
pnpm format           # prettier write
pnpm format:check     # prettier check
pnpm lint             # eslint
```

## Version management — pnpm catalogs

All third-party versions live in `pnpm-workspace.yaml` under `catalog:` (default) and `catalogs:` (named). Packages reference them via:

```jsonc
{
  "dependencies": {
    "reflect-metadata": "catalog:", // default catalog
  },
  "devDependencies": {
    "@nestjs/common": "catalog:nestjs", // named catalog
    "react": "catalog:react",
    "@types/react": "catalog:types",
  },
}
```

Bumping a version once in `pnpm-workspace.yaml` updates every consumer. pnpm resolves `catalog:` and `workspace:*` to real versions at publish time.

## Releases — Changesets

```bash
pnpm changeset            # record change intent
pnpm changeset version    # bump versions, update cross-package deps, write CHANGELOGs
pnpm release              # build + publish (topological order)
```

CI (`.github/workflows/release.yml`) automates this: pushing a changeset to `main` opens a "Version Packages" PR — merging that PR publishes to npm.

## TypeScript

Every package's `tsconfig.json` extends `../tsconfig.base.json`. Every package's `tsup.config.ts` calls `defineBaseConfig(entries)` from `../tsup.config.base.ts`. Package-specific overrides live in the local config.

## License

MIT © Stackra L.L.C
