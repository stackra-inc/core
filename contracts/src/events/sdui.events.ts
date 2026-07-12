/**
 * @file sdui.events.ts
 * @module @stackra/contracts/events
 * @description Event constants emitted by the SDUI (Server-Driven UI)
 *   system. SDUI emits cross-cutting lifecycle events through
 *   `@stackra/events` (the platform `EventEmitter`); listeners react
 *   to invalidate caches, audit user activity, or feed analytics.
 *
 *   The names are stable identifiers consumed by `@OnEvent()` listeners
 *   and the realtime broadcaster. Adding a new event REQUIRES adding
 *   a unique key here — the renderer/back-end never emits raw strings.
 */

/**
 * SDUI lifecycle events.
 *
 * Grouped by category:
 *   - `ACTION_*`        — action lifecycle (Filament-style pipeline)
 *   - `DOCUMENT_*`      — document assembly and invalidation
 *   - `NOTIFICATION_*`  — notification dispatch (delegated to `@stackra/nestjs-notifications`)
 *   - `IMPORT_*`/`EXPORT_*` — transfer-trigger events (delegated to `@stackra/data-transfer`)
 *   - `RATE_LIMIT_*`    — rate-limit enforcement (delegated to `@stackra/rate-limit`)
 *   - `TOAST_*`         — toast lifecycle on the client (cross-tab)
 */
export const SDUI_EVENTS = {
  // ─── Action lifecycle ──────────────────────────────────────────────────────

  /** Emitted when an action is invoked (after validation, before handle). */
  ACTION_INVOKED: 'sdui.action.invoked',
  /** Emitted when an action's `handle()` returns successfully. */
  ACTION_SUCCEEDED: 'sdui.action.succeeded',
  /** Emitted when an action throws or returns `ok: false`. */
  ACTION_FAILED: 'sdui.action.failed',

  // ─── Document lifecycle ────────────────────────────────────────────────────

  /** Emitted when a document is assembled (cache miss). */
  DOCUMENT_BUILT: 'sdui.document.built',
  /** Emitted when a cached document is served verbatim (cache hit). */
  DOCUMENT_CACHED: 'sdui.document.cached',
  /** Emitted when a cached document is purged (by tag or by manual flush). */
  DOCUMENT_INVALIDATED: 'sdui.document.invalidated',

  // ─── Notifications ─────────────────────────────────────────────────────────

  /** Emitted when a notification descriptor is dispatched. */
  NOTIFICATION_CREATED: 'sdui.notification.created',

  // ─── Imports / Exports (delegated to @stackra/data-transfer) ───────────────

  /** Emitted when an import trigger queues a job. */
  IMPORT_QUEUED: 'sdui.import.queued',
  /** Emitted when an import completes (forwarded from data-transfer). */
  IMPORT_COMPLETED: 'sdui.import.completed',
  /** Emitted when an export trigger queues a job. */
  EXPORT_QUEUED: 'sdui.export.queued',
  /** Emitted when an export completes (forwarded from data-transfer). */
  EXPORT_COMPLETED: 'sdui.export.completed',

  // ─── Rate-limiting ─────────────────────────────────────────────────────────

  /** Emitted when an action invocation is rejected by rate-limit policy. */
  RATE_LIMIT_EXCEEDED: 'sdui.rate-limit.exceeded',

  // ─── Toast (client-side) ───────────────────────────────────────────────────

  /** Emitted client-side when a toast is dismissed by the user or by timeout. */
  TOAST_CLOSED: 'sdui.toast.closed',
} as const;

/** Union type of every SDUI event name. */
export type SduiEventName = (typeof SDUI_EVENTS)[keyof typeof SDUI_EVENTS];
