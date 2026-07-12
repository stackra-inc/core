/**
 * @file link-event-payload.interface.ts
 * @module @stackra/contracts/interfaces/link
 * @description Payload shapes for events emitted by `LinkModuleService`.
 *
 *   Every event fired via `linkEventChannel(name, action)` carries
 *   one of these payloads. Cross-package listeners typed against
 *   these interfaces get compile-time guarantees about the fields
 *   they can read (which action-specific fields are guaranteed,
 *   which are optional).
 *
 *   @example
 *   ```typescript
 *   import { LINK_EVENTS, linkEventChannel } from '@stackra/contracts';
 *   import type { ILinkAttachedPayload } from '@stackra/contracts';
 *
 *   @OnEvent(linkEventChannel('RolePermission', LINK_EVENTS.ATTACHED))
 *   onAttached(payload: ILinkAttachedPayload) {
 *     audit.record('role_permission_attached', payload);
 *   }
 *   ```
 */

/**
 * Common fields carried by every link event payload.
 *
 * Every event fired from a `LinkModuleService` operation carries the
 * link's declared name, so subscribers listening on a wildcard channel
 * (`link.*.attached`) know which link fired.
 */
export interface ILinkEventPayloadBase {
  /**
   * The declared link name (e.g. `'RolePermission'`). Matches the
   * `name` field of the corresponding `defineLink()` definition and
   * the second segment of the channel (`link.<linkName>.<action>`).
   */
  readonly linkName: string;

  /**
   * ISO-8601 timestamp captured at emit time. Consumers use this for
   * ordering across links and for audit-log correlation.
   */
  readonly at: string;
}

/**
 * Payload for `linkEventChannel(name, LINK_EVENTS.ATTACHED)`.
 *
 * Fired after one or more pivot records are created (or existing
 * soft-deleted records restored) by `attach()`, `attachMany()`,
 * `bulkAttach()`, or `reclaimOrphaned()`.
 */
export interface ILinkAttachedPayload extends ILinkEventPayloadBase {
  /**
   * The source entity id involved. `undefined` when the emission
   * comes from `bulkAttach()` (which spans multiple sources) — in
   * that case the caller inspects `records` for the source FK.
   */
  readonly sourceId?: string;

  /**
   * The target entity ids that were attached. `undefined` on
   * `bulkAttach()` for the same reason as `sourceId`.
   */
  readonly targetIds?: readonly string[];

  /**
   * The affected pivot records (serialised plain objects — no
   * MikroORM proxies). Present on every attach flavour.
   */
  readonly records: ReadonlyArray<Record<string, unknown>>;
}

/**
 * Payload for `linkEventChannel(name, LINK_EVENTS.DETACHED)`.
 *
 * Fired after one or more pivot records are removed (or soft-deleted)
 * by `detach()`, `detachAll()`, `softDelete()`, or `bulkDetach()`.
 */
export interface ILinkDetachedPayload extends ILinkEventPayloadBase {
  /**
   * The source entity id involved. `undefined` on `bulkDetach()` /
   * `softDelete()` (which take a raw filter).
   */
  readonly sourceId?: string;

  /**
   * The target entity ids that were detached. `undefined` when
   * `detach()` is called without target ids (detach-all), or on
   * bulk / soft-delete flavours.
   */
  readonly targetIds?: readonly string[];

  /**
   * Filter fragments describing which records were affected — used
   * by the bulk / soft-delete flavours where the exact source /
   * target ids are not known at emit time.
   */
  readonly records?: ReadonlyArray<Record<string, unknown>>;
}

/**
 * Payload for `linkEventChannel(name, LINK_EVENTS.SYNCED)`.
 *
 * Fired after `sync()` replaces the full set of links for a source
 * with a new target list.
 */
export interface ILinkSyncedPayload extends ILinkEventPayloadBase {
  /** The source entity whose links were replaced. */
  readonly sourceId: string;

  /**
   * The complete target-id set present AFTER the sync — i.e. what
   * the source is linked to now. Listeners can diff against their
   * cached view to derive the attached / detached deltas.
   */
  readonly targetIds: readonly string[];
}

/**
 * Payload for `linkEventChannel(name, LINK_EVENTS.RESTORED)`.
 *
 * Fired after soft-deleted pivot records are restored via
 * `restore()`.
 */
export interface ILinkRestoredPayload extends ILinkEventPayloadBase {
  /**
   * The filter fragment describing which records were restored.
   */
  readonly records: ReadonlyArray<Record<string, unknown>>;
}
