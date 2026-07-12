/**
 * @file sdui-document-meta.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Document-level metadata attached to every SDUI document.
 *   Drives the renderer's SEO, cache, permission, feature-flag, and
 *   analytics integration without coupling the document body itself.
 */

import type { TranslatableText } from '../../types/sdui/translatable-text.type';
import type { ISduiKbdDescriptor } from './sdui-kbd-descriptor.interface';

/**
 * Metadata block attached to every `SduiDocument`. The renderer reads
 * each field independently — missing fields are treated as "use the
 * documented default".
 */
export interface ISduiDocumentMeta {
  /** The browser/window title (and the document's `<h1>` if rendered). */
  readonly title: TranslatableText;

  /** Optional description used in the page meta and SEO snippet. */
  readonly description?: TranslatableText;

  /**
   * Permissions required to view the document. The renderer hides
   * the document and redirects to the documented forbidden route
   * when the current actor lacks any of these.
   */
  readonly permissions?: readonly string[];

  /**
   * Feature flag keys the document depends on. The renderer evaluates
   * each through `@stackra/feature-flags`; any disabled flag causes
   * the "feature unavailable" placeholder to render.
   */
  readonly featureFlags?: readonly string[];

  /**
   * Caching directive for the resolve endpoint. `ttl` is in seconds,
   * `tags` drive event-based invalidation.
   */
  readonly cache?: {
    readonly ttl: number;
    readonly tags: readonly string[];
  };

  /**
   * SEO metadata mirrored into the page `<head>`. The shape mirrors
   * the well-known OpenGraph + Twitter card fields; `@stackra/seo`
   * owns the exact rendering.
   */
  readonly seo?: {
    readonly title?: string;
    readonly description?: string;
    readonly keywords?: readonly string[];
    readonly canonical?: string;
    readonly og?: Readonly<Record<string, string>>;
    readonly twitter?: Readonly<Record<string, string>>;
  };

  /**
   * Analytics hint. The renderer fires a `page-view`-style event with
   * `pageName` plus the supplied props through `@stackra/tracking`.
   */
  readonly analytics?: {
    readonly pageName: string;
    readonly props?: Readonly<Record<string, unknown>>;
  };

  /**
   * Realtime channels the document subscribes to. The renderer wires
   * each channel via `@stackra/realtime` and triggers a soft
   * re-fetch when the document is invalidated.
   */
  readonly channels?: readonly string[];

  /**
   * Keyboard shortcuts the document owns while mounted. Registered
   * via `@stackra/kbd` on mount, deregistered on unmount.
   */
  readonly shortcuts?: readonly ISduiKbdDescriptor[];
}
