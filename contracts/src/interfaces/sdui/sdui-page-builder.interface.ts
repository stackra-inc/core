/**
 * @file sdui-page-builder.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Contract for a standalone SDUI page. A page is a
 *   resource-less screen built through the same SDUI engine —
 *   dashboards, settings, auth flows, marketing landings.
 *
 *   Pages share the cache layer, invalidation matrix, and
 *   contributor pipeline with resources; they differ only in not
 *   being bound to a single entity.
 */

import type { ISduiDocument } from './sdui-document.interface';

/**
 * Runtime context for `ISduiPageBuilder.build()`. Mirrors
 * `ISduiSceneBuildContext` but without the resource binding.
 */
export interface ISduiPageBuildContext {
  /** Page identifier the assembler is building. */
  readonly pageName: string;
  /** Path params from the request. */
  readonly params: Readonly<Record<string, unknown>>;
  /** Query params from the request. */
  readonly query: Readonly<Record<string, unknown>>;
  /** Scope context. */
  readonly scope: Readonly<Record<string, unknown>>;
  /** Active locale. */
  readonly locale: string;
  /** Authenticated user (loose-typed). */
  readonly user?: Readonly<Record<string, unknown>>;
  /** Module configuration snapshot. */
  readonly config?: Readonly<Record<string, unknown>>;
}

/**
 * Auth requirement for a page. The renderer enforces it before
 * mounting:
 *
 * - `'public'`         — anyone may see it.
 * - `'authenticated'`  — only signed-in users.
 * - `'guest-only'`     — only anonymous visitors (used by login pages).
 */
export type SduiPageAuth = 'public' | 'authenticated' | 'guest-only';

/**
 * Contract every `@SduiPage()`-decorated class implements.
 *
 * @example Dashboard page
 * ```ts
 * @SduiPage('dashboard')
 * export class DashboardPage implements ISduiPageBuilder {
 *   readonly name = 'dashboard';
 *   readonly path = '/dashboard';
 *   readonly layout = 'app';
 *   readonly auth = 'authenticated';
 *   build(ctx) { return assembleDashboardDocument(ctx); }
 * }
 * ```
 */
export interface ISduiPageBuilder {
  /** Page identifier — unique across the registry. */
  readonly name: string;

  /**
   * Path the page is mounted at. The router uses this for navigation
   * and the resolve endpoint matches it for cache key derivation.
   */
  readonly path: string;

  /**
   * Layout the page renders inside (`'app'`, `'auth'`, `'landing'`,
   * `'embed'`, …).
   */
  readonly layout: string;

  /** Auth requirement. Defaults to `'authenticated'`. */
  readonly auth?: SduiPageAuth;

  /**
   * Platforms the page supports (`'web'`, `'native'`, both). The
   * registry rejects documents that resolve a page for a platform
   * it doesn't support.
   */
  readonly platforms?: ReadonlyArray<'web' | 'native'>;

  /**
   * Build the page's document. May be sync or async; the runtime
   * caches the assembled document per the page's `meta.cache`
   * directive.
   */
  build(ctx: ISduiPageBuildContext): ISduiDocument | Promise<ISduiDocument>;
}
