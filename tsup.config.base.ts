/**
 * Shared tsup config helper for every workspace package.
 *
 * Each package's local `tsup.config.ts` calls `defineBaseConfig(entries, {...})`.
 * The base config auto-externalises anything in `dependencies` and
 * `peerDependencies`; anything imported optionally at runtime (lazy `require`
 * / `await import`) must be listed in the `external` override.
 */

import { defineConfig, type Options } from 'tsup';

export type Entries = Record<string, string>;

export function defineBaseConfig(entry: Entries, overrides: Partial<Options> = {}) {
  return defineConfig({
    entry,
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    treeshake: true,
    target: 'es2022',
    tsconfig: './tsconfig.json',
    // Preserve class names — the DI container uses `Class.name` as
    // provider identity.
    keepNames: true,
    ...overrides,
  });
}
