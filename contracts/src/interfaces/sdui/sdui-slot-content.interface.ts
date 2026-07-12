/**
 * @file sdui-slot-content.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Tagged union describing what fills a single slot in a
 *   `SduiDocument`. Three kinds are recognised:
 *
 *   - `kind: 'scene'`     — a registered SDUI scene (list, form, …).
 *                          The renderer mounts the matching component
 *                          from `SceneComponentRegistry`.
 *   - `kind: 'tree'`      — a page-builder `ComponentNode` graph.
 *                          The renderer delegates to
 *                          `@stackra/page-builder`'s `BlockRenderer`.
 *   - `kind: 'document'`  — a nested `SduiDocument`. The renderer
 *                          recurses through `SduiDocumentRenderer` —
 *                          useful for nested shells (drawer-in-app).
 *
 *   The three kinds keep SDUI extensible: any future content type
 *   (e.g. a streaming media kind) becomes a fourth tag without
 *   breaking the existing branches.
 */

/**
 * Opaque reference to a page-builder root node. `ComponentNode` lives
 * in `@stackra/page-builder`; we use `unknown` here so contracts has
 * no runtime dependency on the page-builder package.
 */
export type SduiTreeRoot = unknown;

/**
 * Slot content where a registered scene fills the region. The
 * `config` shape depends on the registered scene type — refer to
 * `ISduiSceneBuilder` for the catalog.
 */
export interface ISduiSceneSlotContent {
  readonly kind: 'scene';
  /** The registered scene type (e.g. `'list'`, `'form'`, `'show'`). */
  readonly type: string;
  /** Scene-specific config. Validated by the scene's `configSchema()`. */
  readonly config: unknown;
  /**
   * Optional widget references emitted by `@SduiWidget()` definitions
   * whose registered zone falls inside this scene. Keyed by zone
   * name; the renderer mounts each matching React component with the
   * server-supplied props.
   */
  readonly extensions?: Readonly<
    Record<
      string,
      ReadonlyArray<{
        readonly type: string;
        readonly props: Readonly<Record<string, unknown>>;
      }>
    >
  >;
}

/**
 * Slot content where a page-builder tree fills the region. The
 * `root` is the same `ComponentNode` shape produced by
 * `@stackra/page-builder` so the renderer can hand it to
 * `BlockRenderer` verbatim.
 */
export interface ISduiTreeSlotContent {
  readonly kind: 'tree';
  /** A page-builder `ComponentNode` root. */
  readonly root: SduiTreeRoot;
}

/**
 * Slot content where a nested SDUI document fills the region. Forward
 * declaration of the recursive document type lives in
 * `sdui-document.interface.ts`.
 */
export interface ISduiDocumentSlotContent {
  readonly kind: 'document';
  // We re-use a structural pointer to avoid a circular import at
  // type-check time. The renderer treats this as a `SduiDocument`.
  readonly document: unknown;
}

/**
 * Union of the three slot content kinds. The discriminator is the
 * `kind` field — switch on it to access shape-specific fields.
 */
export type SduiSlotContent =
  ISduiSceneSlotContent | ISduiTreeSlotContent | ISduiDocumentSlotContent;
