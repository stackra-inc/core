/**
 * @file index.ts
 * @module @stackra/contracts/interfaces
 * @description Complete barrel for every public interface declared in
 *   `@stackra/contracts/interfaces/`.
 *
 *   Every entry below wildcard-forwards from the matching subfolder's
 *   own barrel — new interfaces added to any subfolder show up here
 *   automatically. Keep the list alphabetically sorted so additions
 *   are trivial to eyeball in code review.
 *
 *   Note: the root `src/index.ts` also re-exports these subfolders
 *   directly for the canonical `@stackra/contracts` surface. This
 *   nested barrel exists so tooling that walks the interfaces
 *   folder (docs generators, migration scripts, etc.) can pick up
 *   everything from a single import path.
 */

export * from './container';
export * from './discovery';
