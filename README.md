# pixielity

pnpm monorepo containing the pixielity DI container and its supporting packages.

## Packages

| Package                 | Path            | Description                                                        |
| ----------------------- | --------------- | ------------------------------------------------------------------ |
| `@stackra/container`    | `container/`    | NestJS-compatible DI container (core, React bindings, Nest bridge) |
| `@stackra/contracts`    | `contracts/`    | Shared DI tokens, interfaces, and enums                            |
| `@stackra/nestjs-types` | `nestjs-types/` | Zero-runtime re-host of NestJS 11 types, enums, and constants      |
| `@stackra/testing`      | `testing/`      | Vitest preset, setup lifecycle, matchers, and test helpers         |

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
pnpm test             # vitest run across every package
pnpm test:watch       # vitest watch mode across every package
pnpm test:coverage    # coverage report across every package
pnpm build            # currently a JIT no-op — packages ship raw TS
pnpm format           # prettier write
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

Bumping a version once in `pnpm-workspace.yaml` updates every consumer.

## TypeScript

Every package's `tsconfig.json` extends `../tsconfig.base.json`. Package-specific overrides — `rootDir`, `outDir`, `types`, aliases — live in the local `tsconfig.json`.
