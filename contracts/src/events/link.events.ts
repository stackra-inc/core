/**
 * @file link.events.ts
 * @module @stackra/contracts/events
 * @description Event-name constants for link (many-to-many pivot) operations.
 *
 *   Emitted by `LinkModuleService` on the shared event emitter every
 *   time pivot records are attached, detached, synced, or restored.
 *   Because links are defined per-relationship at runtime, the full
 *   event channel embeds the link name:
 *
 *     `link.<linkName>.<action>`
 *
 *   For example, a link declared as
 *   `defineLink({ name: 'RolePermission', ... })` publishes:
 *
 *     - `link.RolePermission.attached`
 *     - `link.RolePermission.detached`
 *     - `link.RolePermission.synced`
 *     - `link.RolePermission.restored`
 *
 *   Consumers listen either to a specific link's channel
 *   (`@OnEvent('link.RolePermission.attached')`) or to a wildcard
 *   pattern via their event emitter's `on('link.*.attached', ...)`
 *   subscription — see `@stackra/events` for wildcard support.
 *
 *   ## Building channel names
 *
 *   Never concatenate the channel manually. Use {@link linkEventChannel}
 *   so the format is enforced in one place and future changes
 *   (e.g. adding a scope prefix) don't leak into every callsite.
 *
 *   @example
 *   ```typescript
 *   import { LINK_EVENTS, linkEventChannel } from '@stackra/contracts';
 *
 *   const channel = linkEventChannel('RolePermission', LINK_EVENTS.ATTACHED);
 *   // → 'link.RolePermission.attached'
 *
 *   this.events.emit(channel, payload);
 *   ```
 */

/**
 * Root prefix for every link-scoped event channel. Exposed so
 * subscribers can build wildcard filters
 * (`${LINK_EVENT_PREFIX}.*.attached`) without hardcoding the string.
 */
export const LINK_EVENT_PREFIX = 'link' as const;

/**
 * Action suffixes emitted after link mutations. Combined with a link
 * name via {@link linkEventChannel} to build the full channel name.
 *
 * Payload shape (declared in
 * `@stackra/contracts/interfaces/link/link-event-payload.interface.ts`):
 * - `ATTACHED`  — `ILinkAttachedPayload`
 * - `DETACHED`  — `ILinkDetachedPayload`
 * - `SYNCED`    — `ILinkSyncedPayload`
 * - `RESTORED`  — `ILinkRestoredPayload`
 */
export const LINK_EVENTS = {
  /** Fired after records were successfully attached to the pivot table. */
  ATTACHED: 'attached',
  /** Fired after records were removed (or soft-deleted) from the pivot. */
  DETACHED: 'detached',
  /** Fired after `sync()` replaces the full set of links for a source. */
  SYNCED: 'synced',
  /** Fired when soft-deleted records are restored. */
  RESTORED: 'restored',
} as const;

/**
 * Union of the action suffixes in {@link LINK_EVENTS}.
 */
export type LinkEventAction = (typeof LINK_EVENTS)[keyof typeof LINK_EVENTS];

/**
 * Build the fully-qualified event channel name for a specific link.
 *
 * @param linkName - The link's declared name (e.g. `'RolePermission'`).
 * @param action   - One of the {@link LINK_EVENTS} action suffixes.
 * @returns The channel string in the form `link.<linkName>.<action>`.
 *
 * @example
 * ```typescript
 * linkEventChannel('RolePermission', LINK_EVENTS.ATTACHED);
 * // → 'link.RolePermission.attached'
 * ```
 */
export function linkEventChannel(linkName: string, action: LinkEventAction): string {
  return `${LINK_EVENT_PREFIX}.${linkName}.${action}`;
}
