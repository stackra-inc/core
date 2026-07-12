/**
 * @file nestjs-optional-middleware.d.ts
 * @description Ambient module declarations for optional NestJS middleware
 *   and packages that are lazy-loaded via `await import(...)` inside a
 *   try/catch. Consumers install them a la carte; this container package
 *   ships no runtime dep on any of them.
 *
 *   These declarations satisfy `tsc --noEmit` without requiring the
 *   packages to be present on disk. If a consumer installs a package,
 *   its own types take precedence over these placeholders.
 */

// ── Middleware ─────────────────────────────────────────────────────────────

declare module 'helmet' {
  const helmet: (options?: Record<string, unknown>) => (...args: unknown[]) => unknown;
  export default helmet;
}

declare module 'compression' {
  const compression: (options?: Record<string, unknown>) => (...args: unknown[]) => unknown;
  export default compression;
}

declare module 'cookie-parser' {
  const cookieParser: (secret?: string) => (...args: unknown[]) => unknown;
  export default cookieParser;
}

// ── Optional workspace packages ───────────────────────────────────────────

declare module '@stackra/logger/nestjs' {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  export const LoggerManager: any;
  export class RequestLoggingInterceptor {
    constructor(logger: any);
  }
}

declare module '@stackra/console' {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  export class ConsoleKernel {
    static run(module: any, options?: any): Promise<never>;
  }
}
