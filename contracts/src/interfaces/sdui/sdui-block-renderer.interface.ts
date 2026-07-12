/**
 * @file sdui-block-renderer.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Cross-package contract for the page-builder bridge.
 *
 *   `ISduiTreeSlotContent` carries an opaque `SduiTreeRoot` (typically
 *   a `@stackra/page-builder` `ComponentNode`). The SDUI renderer
 *   delegates the actual tree → JSX conversion to whichever
 *   `IBlockRenderer` is wired through DI / context — that keeps the
 *   SDUI package free of a hard runtime dependency on the page-builder
 *   package.
 *
 *   The bridge has two shapes:
 *
 *   - **`IBlockRenderer`** — a renderer instance the consumer binds
 *     to the SDUI tree-slot mount point. The default implementation
 *     wraps `@stackra/page-builder`'s `BlockRenderer`; tests bind a
 *     stub that returns simple markup.
 *
 *   - **`ISduiTreeRenderProps`** — the props the renderer receives
 *     when it renders a tree slot. Loose-typed (`unknown` for the
 *     React node) so contracts stays React-free.
 */

/**
 * Pluggable tree-slot renderer. Consumers register one implementation
 * (typically `@stackra/page-builder`'s `BlockRenderer`) and the SDUI
 * tree slot component delegates to it.
 *
 * The interface is intentionally minimal — `render()` takes the
 * opaque tree root + an environment bag, and returns whatever the
 * platform considers a renderable value (React element, JSX, native
 * primitives, …).
 */
export interface IBlockRenderer {
  /**
   * Render a tree-slot root. The returned value is platform-specific:
   * a `ReactNode` on web, a `ReactElement` on native, an HTML string
   * for SSR-only paths, etc. Callers consume the return value
   * verbatim and never inspect it.
   *
   * @param root - The opaque tree root carried by
   *   `ISduiTreeSlotContent.root`. Typically a
   *   `@stackra/page-builder` `ComponentNode`.
   * @param env  - Per-render environment bag (locale, scope, user).
   *   Forwarded verbatim so the page-builder runtime can resolve
   *   bindings without re-injecting from the rendering platform.
   * @returns The renderer's platform-specific output.
   */
  render(root: unknown, env: ITreeRenderEnvironment): unknown;
}

/**
 * Per-render environment bag handed to the renderer. The fields
 * mirror the SDUI scene context so the page-builder runtime can
 * resolve bindings (`{{ user.name }}`, `{{ scope.tenantId }}`, …)
 * without a second injection round-trip.
 */
export interface ITreeRenderEnvironment {
  /** Active locale code (BCP-47). */
  readonly locale: string;
  /** Scope context (loose-typed for cross-package neutrality). */
  readonly scope: Readonly<Record<string, unknown>>;
  /** Authenticated user (loose-typed). */
  readonly user?: Readonly<Record<string, unknown>>;
  /**
   * Free-form data bag — additional context the host renderer
   * threads through (e.g. theme tokens, feature flags).
   */
  readonly data?: Readonly<Record<string, unknown>>;
}
