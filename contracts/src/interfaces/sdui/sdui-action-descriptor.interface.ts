/**
 * @file sdui-action-descriptor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Action descriptor emitted by scene builders. Each
 *   descriptor names a registered action handler plus the visual
 *   chrome (label, icon, color) and execution target (drawer, modal,
 *   redirect, toast-only).
 *
 *   The descriptor is JSON-serializable; behaviour is referenced by
 *   handler `type` and resolved at runtime through `ActionRegistry`.
 */

import type { HeroUIColor } from '../../enums/sdui/heroui-color.enum';
import type { HeroUISize } from '../../enums/sdui/heroui-size.enum';
import type { HeroUIVariant } from '../../enums/sdui/heroui-variant.enum';
import type { TranslatableText } from '../../types/sdui/translatable-text.type';
import type { ISduiConfirmationDescriptor } from './sdui-confirmation-descriptor.interface';
import type { ISduiKbdDescriptor } from './sdui-kbd-descriptor.interface';
import type { ISduiRedirectDescriptor } from './sdui-redirect-descriptor.interface';
import type { SduiRateLimitDescriptor } from './sdui-rate-limit-descriptor.interface';

/**
 * Where the action chrome surfaces in the rendered scene.
 *
 * - `'button'`     — primary call-to-action button on a section/toolbar.
 * - `'row'`        — per-row action in a list scene.
 * - `'bulk'`       — bulk action driven by row selection.
 * - `'page'`       — page-level header action (always visible).
 * - `'menu-item'`  — entry inside an overflow menu / context menu.
 * - `'toolbar'`    — action mounted on the scene toolbar.
 */
export type SduiActionDisplayAs = 'button' | 'row' | 'bulk' | 'page' | 'menu-item' | 'toolbar';

/**
 * Execution target — what happens visually when the action fires.
 *
 * - `'inline'`     — execute and stay on the current document.
 * - `'drawer'`     — open a side drawer (typically a form).
 * - `'modal'`      — open a centered modal.
 * - `'dialog'`     — open an alert dialog (confirmation only).
 * - `'sheet'`      — open a bottom sheet (mobile-friendly modal).
 * - `'redirect'`   — navigate to the resolved `redirect.to`.
 * - `'toast-only'` — execute silently and show a toast result.
 */
export type SduiActionTarget =
  'inline' | 'drawer' | 'modal' | 'dialog' | 'sheet' | 'redirect' | 'toast-only';

/**
 * Reference to a form schema attached to an action. The renderer
 * resolves the schema via the action's `schema()` method on the
 * backend; this field carries enough information to route the form
 * submission to the right endpoint.
 */
export interface ISduiFormSchemaRef {
  /** Form key — uniquely identifies the form inside the action. */
  readonly formKey: string;
  /** Endpoint the form submission posts to. */
  readonly endpoint: string;
  /** HTTP method (default `'POST'`). */
  readonly method?: 'POST' | 'PUT' | 'PATCH';
}

/**
 * JSON descriptor for one action — emitted by scene builders and
 * rendered as a button, row action, or page action.
 */
export interface ISduiActionDescriptor {
  /** Action handler type — matches a `@SduiAction()` registration. */
  readonly type: string;

  /** Stable key for the renderer (used as React `key`). */
  readonly key: string;

  /** User-facing label (button text). */
  readonly label: TranslatableText;

  /** Optional icon name. Resolved by the frontend icon registry. */
  readonly icon?: string;

  /** Optional HeroUI button color. */
  readonly color?: HeroUIColor;

  /** Optional HeroUI button variant. */
  readonly variant?: HeroUIVariant;

  /** Optional HeroUI button size. */
  readonly size?: HeroUISize;

  /**
   * Permissions required to see and invoke the action. The renderer
   * hides the action when the actor lacks any of them.
   */
  readonly permissions?: readonly string[];

  /**
   * Feature flag keys gating the action. The renderer hides the
   * action when any flag is disabled.
   */
  readonly featureFlags?: readonly string[];

  /**
   * Optional confirmation prompt rendered before the action handler
   * is invoked.
   */
  readonly confirmation?: ISduiConfirmationDescriptor;

  /**
   * Optional form schema reference. When present, the renderer
   * opens a modal/drawer with a form and submits the values.
   */
  readonly form?: ISduiFormSchemaRef;

  /** Where the action chrome appears in the scene. */
  readonly displayAs: SduiActionDisplayAs;

  /** What visually happens when the action fires. */
  readonly target: SduiActionTarget;

  /**
   * Redirect descriptor — only used when `target === 'redirect'`.
   * The renderer hands the resolved URL to `@stackra/router`.
   */
  readonly redirect?: ISduiRedirectDescriptor;

  /**
   * Optional keyboard shortcut binding. Registered with
   * `@stackra/kbd` while the action is mounted.
   */
  readonly keyboard?: ISduiKbdDescriptor;

  /**
   * Optional rate-limit policy. The executor consults
   * `@stackra/rate-limit` before invoking the handler.
   */
  readonly rateLimit?: SduiRateLimitDescriptor;
}
