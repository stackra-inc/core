/**
 * @file sdui-contributor-context.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Runtime context handed to every SDUI contributor (
 *   navigation, feature flag, subscription channel, command,
 *   shortcut). Contributors react to a request and emit content the
 *   assembler bakes into the document.
 */

/**
 * Per-request contributor context.
 */
export interface ISduiContributorContext {
  /** Resource name being assembled. */
  readonly resourceName?: string;
  /** Page name being assembled. */
  readonly pageName?: string;
  /** Scene type being assembled (when applicable). */
  readonly sceneType?: string;
  /** Path params. */
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
