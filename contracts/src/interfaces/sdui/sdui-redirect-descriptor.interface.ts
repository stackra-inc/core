/**
 * @file sdui-redirect-descriptor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Descriptor for actions whose `target: 'redirect'` causes
 *   the renderer to navigate after invocation. The renderer hands the
 *   resolved URL to `@stackra/router`'s `useGo()`.
 */

/**
 * Descriptor for a post-action redirect. The renderer interpolates
 * `params` into the target path and pushes (or replaces) the route.
 */
export interface ISduiRedirectDescriptor {
  /**
   * Target path, optionally with `:param` placeholders that are
   * filled from the surrounding record (e.g. `/orders/:id/edit`).
   */
  readonly to: string;

  /**
   * Replace the current history entry instead of pushing a new one.
   * Defaults to `false`.
   */
  readonly replace?: boolean;

  /**
   * Optional state object forwarded to the destination route. The
   * router exposes it via `useLocation().state`.
   */
  readonly state?: Readonly<Record<string, unknown>>;
}
