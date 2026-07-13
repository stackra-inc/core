/**
 * @file seed-loader.util.ts
 * @module @stackra/ssr/core/server/utils
 * @description Builds a lifecycle-aware "seed loader" provider.
 *
 *   `forFeature(...)` needs to seed a registry with inline definitions.
 *   Rather than run a side effect inside a `useFactory` (a synthetic
 *   marker), we return an object that implements `onApplicationBootstrap`.
 *   The container's instance loader duck-types every resolved instance
 *   and invokes `onApplicationBootstrap()` on it — so the seeding runs in
 *   the proper lifecycle phase, after all `onModuleInit` hooks, alongside
 *   discovery.
 *
 *   This supports any number of `forFeature(...)` calls: each produces a
 *   distinct provider token with its own loader, so contributions from
 *   multiple feature modules all run (the container is last-wins per
 *   token, which is why a shared token would drop all but the last).
 */

import type { OnApplicationBootstrap } from '@stackra/contracts';

/**
 * A resolved provider that seeds state in `onApplicationBootstrap`.
 */
export interface SeedLoader extends OnApplicationBootstrap {
  onApplicationBootstrap(): void;
}

/**
 * Create a `SeedLoader` from a thunk. The thunk runs once, in the
 * `onApplicationBootstrap` phase.
 */
export function createSeedLoader(seed: () => void): SeedLoader {
  return {
    onApplicationBootstrap(): void {
      seed();
    },
  };
}

/**
 * Mint a unique provider token for a seed loader. Unique per call so
 * multiple `forFeature(...)` registrations don't collide under the
 * container's last-wins token semantics.
 */
export function seedLoaderToken(label: string): symbol {
  return Symbol(`${label}:${Math.random().toString(36).slice(2)}`);
}
