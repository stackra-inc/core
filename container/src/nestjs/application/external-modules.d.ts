/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file external-modules.d.ts
 * @module @stackra/container/nestjs
 * @description Type declarations for optional external modules that are dynamically imported.
 *   These are optional peer dependencies — the application gracefully skips them if not installed.
 */

declare module 'helmet' {
  function helmet(options?: Record<string, unknown>): any;
  export default helmet;
}

declare module 'cookie-parser' {
  function cookieParser(secret?: string): any;
  export default cookieParser;
}

declare module 'compression' {
  function compression(options?: Record<string, unknown>): any;
  export default compression;
}

// NOTE: Ambient declarations for `http-terminator` and `@stackra/nestjs-response`
// were removed alongside the dynamic imports that used them in `application.ts`.
// Neither package is installed in this workspace and consumers (e.g. @stackra/sdui)
// don't see these `.d.ts` files during their own typechecks, which led to
// pre-existing TS2307 errors. If either package is reintroduced, add the
// declaration back here (or, preferably, a real dependency with its own types).

// NOTE: The ambient declaration for `@stackra/console` was removed for the
// same reason as `@stackra/logger/nestjs` below. Keeping a stub that only
// exported `ConsoleKernel` shadowed the real module's `Command`, `BaseCommand`
// and everything else, so any file (like `@stackra/logger`'s CLI commands)
// that imports from `@stackra/console` failed downstream typecheck with
// "no exported member 'Command'". With the stub removed, TypeScript resolves
// the real console exports via the workspace symlink; the runtime
// `try { await import(...) } catch` in `application.ts` still handles the
// case where consumers don't install `@stackra/console`.

// NOTE: The ambient declaration for `@stackra/logger/nestjs` was removed because
// the package IS resolvable as a workspace peer (see `peerDependenciesMeta` in
// package.json). Keeping a stub here caused the ambient declaration to shadow
// the real module's exports — in particular, `LoggerManager` was hidden and the
// real `RequestLoggingInterceptor(manager: LoggerManager)` constructor signature
// was masked by the stub's parameterless declaration. With the stub removed,
// TypeScript resolves the real types via the workspace symlink. The runtime
// `try { await import(...) } catch` in `application.ts` still gracefully handles
// the case where the package is not installed in a downstream consumer.
