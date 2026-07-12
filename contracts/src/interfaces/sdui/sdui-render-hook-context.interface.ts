/**
 * @file sdui-render-hook-context.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Runtime context handed to `@SduiRenderHook()`
 *   contributors. The context exposes everything a hook needs to
 *   decide whether (and what) to render at a given zone.
 */

/**
 * Per-invocation context for a render hook.
 */
export interface ISduiRenderHookContext {
  /** Resource name being assembled (omitted for pages). */
  readonly resourceName?: string;
  /** Page name being assembled (omitted for resources). */
  readonly pageName?: string;
  /** Scene type the hook is firing inside of. */
  readonly sceneType?: string;
  /** Path params (`:id`, `:slug`, …). */
  readonly params: Readonly<Record<string, unknown>>;
  /** Query params. */
  readonly query: Readonly<Record<string, unknown>>;
  /** Scope context. */
  readonly scope: Readonly<Record<string, unknown>>;
  /** Active locale. */
  readonly locale: string;
  /** Authenticated user (loose-typed). */
  readonly user?: Readonly<Record<string, unknown>>;
}
