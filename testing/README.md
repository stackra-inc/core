# @stackra/testing

Shared Vitest preset and setup file for the pixielity monorepo.

Two subpath exports, both JIT source (no build step):

| Export                    | File                  | Purpose                                                                                                                 |
| ------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `@stackra/testing/preset` | `src/preset/index.ts` | Vitest config with globals, node env, coverage defaults, and the `@ → ./src` alias. Merge into your `vitest.config.ts`. |
| `@stackra/testing/setup`  | `src/preset/setup.ts` | Global `afterEach` cleanup — real timers, restored mocks, unstubbed globals & env. Load via `setupFiles`.               |

## Usage

**`vitest.config.ts`** in a consumer package:

```ts
import { defineConfig, mergeConfig } from 'vitest/config';
import path from 'node:path';
import preset from '@stackra/testing/preset';

export default mergeConfig(
  preset,
  defineConfig({
    test: {
      environment: 'node',
      setupFiles: ['./__tests__/vitest.setup.ts'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  })
);
```

**`__tests__/vitest.setup.ts`** in a consumer package:

```ts
import '@stackra/testing/setup';
```

That's the entire public surface.
