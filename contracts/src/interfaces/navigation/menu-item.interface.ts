/**
 * @file menu-item.interface.ts
 * @module @stackra/contracts/interfaces/navigation
 * @description Core menu item interface used across the navigation system.
 */

/**
 * Visual / behavioral tag rendered as a chip next to the label.
 */
export interface MenuTag {
  /** Display text. */
  label: string;
  /** Color preset. */
  color?: 'default' | 'success' | 'warning' | 'danger' | 'accent';
  /** Visual variant. */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'soft';
}

/**
 * Predicate descriptor for conditional visibility.
 */
export interface MenuPredicate {
  /** Predicate type (e.g., "feature", "audience"). */
  type: string;
  /** Predicate name/id. */
  name?: string;
  /** Free-form params consumed by the resolver. */
  params?: Record<string, unknown>;
}

/**
 * Analytics metadata for a menu item.
 */
export interface MenuAnalytics {
  /** Tracking event name emitted on click. */
  event?: string;
  /** Additional properties to include in the tracking payload. */
  properties?: Record<string, unknown>;
}

/**
 * Accessibility overrides for a menu item.
 */
export interface MenuAria {
  /** ARIA label override. */
  label?: string;
  /** ARIA description. */
  description?: string;
  /** ARIA expanded state. */
  expanded?: boolean;
  /** ARIA current value. */
  current?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
}

/**
 * Classification of menu items by behavior.
 */
export enum MenuItemKind {
  /** Standard navigable link. */
  LINK = 'link',
  /** Parent group with children. */
  GROUP = 'group',
  /** Separator / divider. */
  SEPARATOR = 'separator',
  /** Section heading (non-interactive). */
  HEADING = 'heading',
  /** Custom component slot. */
  COMPONENT = 'component',
  /** Action button (triggers a callback). */
  ACTION = 'action',
}

/**
 * Named menu locations in the application layout.
 */
export enum MenuLocation {
  /** Primary top navigation bar. */
  HEADER = 'header',
  /** Left sidebar navigation. */
  SIDEBAR = 'sidebar',
  /** Footer navigation. */
  FOOTER = 'footer',
  /** Mobile bottom tab bar. */
  MOBILE_BAR = 'mobile_bar',
  /** Account/profile dropdown menu. */
  ACCOUNT = 'account',
}

/**
 * Unified menu item shape.
 *
 * Represents a single entry in a navigation menu tree. Used across
 * all navigation components (header, sidebar, footer, mobile bar).
 */
export interface IMenuItem {
  /** Unique identifier. */
  id: string;
  /** Item classification. */
  kind?: MenuItemKind;
  /** Display label (translatable key or raw string). */
  label: string;
  /** i18n key for label. */
  labelI18n?: string;
  /** Short description text. */
  description?: string;
  /** i18n key for description. */
  descriptionI18n?: string;
  /** Navigation target URL/path. */
  to?: string;
  /** External link URL. */
  href?: string;
  /** Icon identifier (resolved by IconResolverRegistry). */
  icon?: string;
  /** Image URL for visual items. */
  image?: string;
  /** Alt text for image. */
  imageAlt?: string;
  /** Numeric badge count. */
  badge?: number | string;
  /** Visual tags. */
  tags?: MenuTag[];
  /** Nested children. */
  children?: IMenuItem[];
  /** Sort order weight. */
  order?: number;
  /** Conditional visibility predicates. */
  showWhen?: MenuPredicate | MenuPredicate[] | string;
  /** Whether the item opens in a new tab. */
  external?: boolean;
  /** Link target attribute. */
  target?: string;
  /** Link rel attribute. */
  rel?: string;
  /** Whether the link is a download. */
  download?: boolean | string;
  /** Keyboard shortcut hint. */
  shortcut?: string;
  /** Analytics metadata. */
  analytics?: MenuAnalytics;
  /** Accessibility overrides. */
  aria?: MenuAria;
  /** Whether the item is disabled. */
  disabled?: boolean;
  /** Whether the item is hidden. */
  hidden?: boolean;
  /** Additional metadata. */
  meta?: Record<string, unknown>;
  /** Additional CSS class. */
  className?: string;
  /** Tooltip text. */
  tooltip?: string;
  /** i18n key for tooltip. */
  tooltipI18n?: string;
  /** Required permissions to see this item. */
  permissions?: string[];
  /** Required roles to see this item. */
  roles?: string[];
  /** Prefetch strategy. */
  prefetch?: boolean | 'hover' | 'viewport';
  /** Exact path matching for active state. */
  matchExact?: boolean;
  /** Pattern for active state matching. */
  matchPattern?: string | RegExp;
  /** Multiple paths that activate this item. */
  paths?: string[];
  /** Hide on mobile viewports. */
  hideOnMobile?: boolean;
  /** Hide on tablet viewports. */
  hideOnTablet?: boolean;
  /** Hide on desktop viewports. */
  hideOnDesktop?: boolean;
  /** Hide when user is logged in. */
  hideWhenLoggedIn?: boolean;
  /** Hide when user is logged out. */
  hideWhenLoggedOut?: boolean;
  /** Date from which the item is available. */
  availableFrom?: string | Date;
  /** Date until which the item is available. */
  availableUntil?: string | Date;
  /** Visual variant. */
  variant?: string;
  /** Size variant. */
  size?: string;
  /** Call-to-action button config. */
  cta?: { label: string; to?: string; href?: string; variant?: string };
  /** Resource identifier (for breadcrumb/route matching). */
  resource?: string;
}
