/**
 * @file sdui-page-resolve-request.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Request body shape for `POST /api/sdui/resolve-page`.
 *   Used to assemble standalone, resource-less SDUI documents
 *   (dashboards, auth flows, marketing pages).
 */

/**
 * Page resolve request body.
 */
export interface ISduiPageResolveRequest {
  /** Page name — must match an `@SduiPage()` registration. */
  readonly page: string;

  /** Path params (`:slug`, `:tab`, …). */
  readonly params?: Readonly<Record<string, unknown>>;

  /** Query params. */
  readonly query?: Readonly<Record<string, unknown>>;
}
