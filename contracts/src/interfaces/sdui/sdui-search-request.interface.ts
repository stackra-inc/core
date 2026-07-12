/**
 * @file sdui-search-request.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Request body for `POST /api/sdui/search` — the global
 *   search endpoint backing the command palette.
 */

/**
 * Search request body.
 */
export interface ISduiSearchRequest {
  /** Search query string. */
  readonly q: string;

  /**
   * Optional whitelist of resource names to search inside. When
   * omitted, the service searches every resource the actor has
   * `view` permission for.
   */
  readonly resources?: readonly string[];

  /** Maximum number of hits per resource. Defaults to 5. */
  readonly limit?: number;
}
