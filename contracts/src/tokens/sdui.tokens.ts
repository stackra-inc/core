/**
 * @file sdui.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the SDUI (Server-Driven UI) system.
 *
 *   SDUI is the foundation that lets the backend describe complete,
 *   interactive, HeroUI-native screens that render verbatim on web and
 *   React Native. The tokens below identify the registries, services,
 *   and discovery metadata keys consumed by `@stackra/sdui`.
 */

// ─── Module ──────────────────────────────────────────────────────────────────

/** Token for the resolved SDUI module configuration. */
export const SDUI_CONFIG = Symbol.for('SDUI_CONFIG');

// ─── Registries ──────────────────────────────────────────────────────────────

/** Token for the registry of `@SduiResource()` services. */
export const SDUI_RESOURCE_REGISTRY = Symbol.for('SDUI_RESOURCE_REGISTRY');

/** Token for the registry of `@SduiPage()` builders (resource-less pages). */
export const SDUI_PAGE_REGISTRY = Symbol.for('SDUI_PAGE_REGISTRY');

/** Token for the registry of `@SduiScene()` builders. */
export const SDUI_SCENE_REGISTRY = Symbol.for('SDUI_SCENE_REGISTRY');

/** Token for the registry of `@SduiLayout()` definitions. */
export const SDUI_LAYOUT_REGISTRY = Symbol.for('SDUI_LAYOUT_REGISTRY');

/** Token for the registry of `@SduiAction()` handlers. */
export const SDUI_ACTION_REGISTRY = Symbol.for('SDUI_ACTION_REGISTRY');

/** Token for the registry of `@SduiCluster()` navigation groupings. */
export const SDUI_CLUSTER_REGISTRY = Symbol.for('SDUI_CLUSTER_REGISTRY');

/** Token for the registry of `@SduiContributor()` instances. */
export const SDUI_CONTRIBUTOR_REGISTRY = Symbol.for('SDUI_CONTRIBUTOR_REGISTRY');

/** Token for the registry of `@SduiRenderHook()` backend contributors. */
export const SDUI_RENDER_HOOK_REGISTRY = Symbol.for('SDUI_RENDER_HOOK_REGISTRY');

/** Token for the (distributed) ZoneRegistry of extension points. */
export const SDUI_ZONE_REGISTRY = Symbol.for('SDUI_ZONE_REGISTRY');

/** Token for the registry of `@SduiWidget()` backend definitions. */
export const SDUI_WIDGET_REGISTRY = Symbol.for('SDUI_WIDGET_REGISTRY');

// ─── Services ────────────────────────────────────────────────────────────────

/** Token for the DocumentAssembler service. */
export const SDUI_DOCUMENT_ASSEMBLER = Symbol.for('SDUI_DOCUMENT_ASSEMBLER');

/** Token for the ActionExecutorService. */
export const SDUI_ACTION_EXECUTOR = Symbol.for('SDUI_ACTION_EXECUTOR');

/** Token for the CacheManagerService. */
export const SDUI_CACHE_MANAGER = Symbol.for('SDUI_CACHE_MANAGER');

/** Token for the SceneBuilderService. */
export const SDUI_SCENE_BUILDER = Symbol.for('SDUI_SCENE_BUILDER');

/** Token for the SearchService. */
export const SDUI_SEARCH_SERVICE = Symbol.for('SDUI_SEARCH_SERVICE');

// ─── Discovery metadata keys ─────────────────────────────────────────────────

/** Metadata key for the `@SduiResource()` class decorator. */
export const SDUI_RESOURCE_METADATA_KEY = Symbol.for('stackra:sdui:resource');

/** Metadata key for the `@SduiPage()` class decorator. */
export const SDUI_PAGE_METADATA_KEY = Symbol.for('stackra:sdui:page');

/** Metadata key for the `@SduiScene()` class decorator. */
export const SDUI_SCENE_METADATA_KEY = Symbol.for('stackra:sdui:scene');

/** Metadata key for the `@SduiLayout()` class decorator. */
export const SDUI_LAYOUT_METADATA_KEY = Symbol.for('stackra:sdui:layout');

/** Metadata key for the `@SduiAction()` class decorator. */
export const SDUI_ACTION_METADATA_KEY = Symbol.for('stackra:sdui:action');

/** Metadata key for the `@SduiCluster()` class decorator. */
export const SDUI_CLUSTER_METADATA_KEY = Symbol.for('stackra:sdui:cluster');

/** Metadata key for the `@SduiContributor()` class decorator. */
export const SDUI_CONTRIBUTOR_METADATA_KEY = Symbol.for('stackra:sdui:contributor');

/** Metadata key for the `@SduiRenderHook()` class decorator. */
export const SDUI_RENDER_HOOK_METADATA_KEY = Symbol.for('stackra:sdui:render-hook');

/** Metadata key for the `@SduiWidget()` class decorator. */
export const SDUI_WIDGET_METADATA_KEY = Symbol.for('stackra:sdui:widget');

/** Metadata key for the `@SduiPlatform()` class decorator. */
export const SDUI_PLATFORM_METADATA_KEY = Symbol.for('stackra:sdui:platform');

// ─── Page-builder bridge (Task #11 of SDUI v3) ────────────────────────────────

/**
 * Token for the active `IBlockRenderer` instance.
 *
 * The SDUI tree-slot bridge (`@stackra/sdui/react` → `<TreeSlot>`)
 * looks up the bound renderer via this token. The default
 * implementation wraps `@stackra/page-builder`'s `BlockRenderer`;
 * tests bind a stub that returns trivial markup.
 */
export const SDUI_BLOCK_RENDERER = Symbol.for('SDUI_BLOCK_RENDERER');

// ─── Extension points (override defaults via custom providers) ──────────────

/**
 * Token for the workflow dispatcher used by SDUI action handlers.
 *
 * The consumer module CAN bind a custom dispatcher via `useClass`/`useValue`
 * when they need to wrap the engine (e.g. for tracing, multi-tenant routing).
 * The default implementation in `@stackra/sdui/nestjs` is exported as
 * `WorkflowDispatcherService`.
 */
export const SDUI_WORKFLOW_DISPATCHER = Symbol.for('SDUI_WORKFLOW_DISPATCHER');

/**
 * Token for an optional external search engine.
 *
 * When bound (via a custom provider), `SearchService` delegates to it
 * instead of walking the resource registry. Implementations: Algolia,
 * Typesense, OpenSearch, ElasticSearch.
 */
export const SDUI_SEARCH_ENGINE = Symbol.for('SDUI_SEARCH_ENGINE');
