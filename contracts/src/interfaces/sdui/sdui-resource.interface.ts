/**
 * @file sdui-resource.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Contract for a registered SDUI resource. A resource
 *   ties one logical entity (Order, Customer, Product) to its full
 *   SDUI presence — config + every scene method it supports.
 */

import type { TranslatableText } from '../../types/sdui/translatable-text.type';
import type { ISduiLayoutRef } from './sdui-layout-ref.interface';
import type { ISduiZoneDescriptor } from './sdui-zone-descriptor.interface';

/**
 * Navigation hint for a resource. The
 * `ResourceNavigationContributor` consumes it to emit one item per
 * resource into the sidebar.
 */
export interface ISduiResourceNavigation {
  /** Top-level navigation group (e.g. `'sales'`, `'catalog'`). */
  readonly group?: string;
  /** Parent slug — used to nest resources under a cluster. */
  readonly parent?: string;
  /** Display order inside the group. Lower numbers appear first. */
  readonly order?: number;
  /** Tags rendered as small chips below the navigation item. */
  readonly tags?: readonly string[];
  /** Icon name resolved by the frontend icon registry. */
  readonly icon?: string;
  /** Display label. Defaults to the resource's plural name. */
  readonly label?: TranslatableText;
  /** Optional badge text (e.g. unread count). Server-supplied. */
  readonly badge?: TranslatableText;
}

/**
 * Configuration for a sub-navigation tab under a resource detail
 * page. Lets a large entity be split across logical sections
 * (Details / Activity / Security / Billing) without separate routes.
 */
export interface ISduiSubNavigationItem {
  /** Stable key used by the renderer for the active-tab state. */
  readonly key: string;
  /** Tab label. */
  readonly label: TranslatableText;
  /** Scene type rendered when the tab is active. */
  readonly scene: string;
  /** Optional scene view (e.g. `'security'`) passed in `ctx.params.view`. */
  readonly view?: string;
  /** Permissions required to see and open the tab. */
  readonly permissions?: readonly string[];
  /** Feature flags gating the tab. */
  readonly featureFlags?: readonly string[];
}

/**
 * Configuration for a relation manager embedded in a resource detail
 * page. Renders a scoped list of a related entity with create / edit
 * / delete actions.
 */
export interface ISduiRelationManagerDescriptor {
  /** Stable key. */
  readonly key: string;
  /** Display label. */
  readonly label: TranslatableText;
  /** Related resource name. */
  readonly resource: string;
  /**
   * Foreign-key column on the related resource that points back to
   * the parent. The renderer injects
   * `WHERE foreignKey = parentId` automatically.
   */
  readonly foreignKey: string;
  /** Optional scene type (`'list'` is the default). */
  readonly scene?: 'list' | 'kanban' | 'gallery';
  /** Per-manager extra actions (`'export'`, `'import'`, …). */
  readonly actions?: readonly { readonly type: string; readonly key: string }[];
}

/**
 * Searchable surface declared by a resource — fields the global
 * search service queries against.
 */
export interface ISduiSearchableConfig {
  /** Columns to search through. */
  readonly fields: readonly string[];
  /** Path template used to navigate to a hit (`/customers/:id`). */
  readonly resultPath: string;
  /** Translatable template for each hit row (`'{{name}} ({{email}})'`). */
  readonly resultTemplate: TranslatableText;
}

/**
 * Resource configuration — declared once via `BaseUIService.config()`.
 */
export interface ISduiResourceConfig {
  /** Singular entity name (`{ key: 'order.singular' }`). */
  readonly entitySingular: TranslatableText;
  /** Plural entity name (`{ key: 'order.plural' }`). */
  readonly entityPlural: TranslatableText;
  /**
   * Permission prefix — the resource uses `${prefix}.view`,
   * `${prefix}.create`, `${prefix}.edit`, etc. for fine-grained
   * checks. Default: the resource's `name` (`'orders'`).
   */
  readonly permissionsPrefix: string;
  /**
   * Default scene to render when the resource is accessed without a
   * specific `scene` query param.
   */
  readonly defaultScene: string;
  /** Layout the resource defaults to (typically `'app'`). */
  readonly layout: ISduiLayoutRef;
  /** Navigation hint — omit to hide the resource from the sidebar. */
  readonly navigation?: ISduiResourceNavigation;
  /** Sub-navigation tabs surfacing on the resource detail page. */
  readonly subNavigation?: readonly ISduiSubNavigationItem[];
  /** Relation managers embedded in the resource detail page. */
  readonly relationManagers?: readonly ISduiRelationManagerDescriptor[];
  /** Searchable surface for the global search command. */
  readonly searchable?: ISduiSearchableConfig;
  /** List of scene types the resource supports (`['list', 'form', 'show']`). */
  readonly scenes: readonly string[];
  /** Cluster name — folds the resource under one navigation node. */
  readonly cluster?: string;
}

/**
 * Contract every `@SduiResource()`-decorated class implements. A
 * resource is a class whose `config()` declares the resource's
 * static metadata and whose scene methods (`list()`, `form()`,
 * `show()`, …) emit the scene config for each request.
 *
 * Scene methods are NOT declared on this interface because their
 * return types depend on each scene's config shape. The runtime
 * dispatches to them dynamically by reading the matching property
 * from the resource instance, so consumers may type their classes
 * with whatever shape works locally without satisfying an index
 * signature here.
 */
export interface ISduiResource {
  /** Resource name — the singular entity name in snake_case. */
  readonly name: string;

  /** Static resource configuration. Called once per registry refresh. */
  config(): ISduiResourceConfig;

  /**
   * Optional list of zones contributed by this resource. The
   * runtime auto-registers the standard families
   * (`{name}.list.before`, `{name}.details.side.after`, …) — only
   * declare extras here.
   */
  zones?(): readonly ISduiZoneDescriptor[];
}
