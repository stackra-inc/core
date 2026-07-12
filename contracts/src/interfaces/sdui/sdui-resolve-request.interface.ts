/**
 * @file sdui-resolve-request.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Request body shape for `POST /api/sdui/resolve`. The
 *   server assembles the matching document.
 */

import type { SduiMode } from '../../enums/sdui/sdui-mode.enum';

/**
 * Resolve request body. The renderer sends this to the resolve
 * endpoint when navigating to a SDUI-backed route.
 */
export interface ISduiResolveRequest {
  /**
   * Resource name. Required for resource-backed documents; omit for
   * standalone pages (`ISduiPageResolveRequest` is the matching
   * shape for those).
   */
  readonly resource?: string;

  /** Scene type to render. Defaults to the resource's `defaultScene`. */
  readonly scene?: string;

  /** Optional render mode hint. */
  readonly mode?: SduiMode;

  /** Path params from the route (`:id`, `:slug`, …). */
  readonly params?: Readonly<Record<string, unknown>>;

  /** Query params from the URL. */
  readonly query?: Readonly<Record<string, unknown>>;

  /** Free-form context payload (loose-typed). */
  readonly context?: Readonly<Record<string, unknown>>;
}
