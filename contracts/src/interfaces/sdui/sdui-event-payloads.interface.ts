/**
 * @file sdui-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Typed payloads for every constant in `SDUI_EVENTS`.
 *
 *   Payload interfaces for cross-cutting subsystem events
 *   (notifications, imports, exports, rate-limit, toast) live
 *   alongside the `SduiEventDispatcher` service that emits them
 *   inside `@stackra/sdui`. This file provides the shapes that
 *   would be surfaced to `@OnEvent` listeners on the shared bus.
 */

/**
 * Payload for `SDUI_EVENTS.ACTION_INVOKED` — an action's `handle()`
 * pipeline is about to run.
 */
export interface ISduiActionInvokedPayload {
  /** Action type identifier (registered with `ActionRegistry`). */
  readonly actionType: string;
}

/**
 * Payload for `SDUI_EVENTS.ACTION_SUCCEEDED` — the action's
 * `handle()` returned `ok: true`.
 */
export interface ISduiActionSucceededPayload {
  /** Action type identifier. */
  readonly actionType: string;
  /** Wall-clock run duration in milliseconds. */
  readonly runDurationMs: number;
}

/**
 * Payload for `SDUI_EVENTS.ACTION_FAILED` — the action threw or
 * returned `ok: false`.
 */
export interface ISduiActionFailedPayload {
  /** Action type identifier. */
  readonly actionType: string;
  /** Wall-clock run duration in milliseconds. */
  readonly runDurationMs: number;
  /** Optional error envelope from the response. */
  readonly error?: unknown;
}

/**
 * Payload for `SDUI_EVENTS.DOCUMENT_BUILT` — a document was
 * assembled from the registries.
 */
export interface ISduiDocumentBuiltPayload {
  /** Resolved document id / key. */
  readonly documentId: string;
  /** Cache tag written alongside the document (used for invalidation). */
  readonly cacheTag?: string;
}

/**
 * Payload for `SDUI_EVENTS.DOCUMENT_CACHED` — a cached document
 * was served without re-assembly.
 */
export interface ISduiDocumentCachedPayload {
  readonly documentId: string;
}

/**
 * Payload for `SDUI_EVENTS.DOCUMENT_INVALIDATED` — a cached
 * document (or set) was purged.
 */
export interface ISduiDocumentInvalidatedPayload {
  /** Documents purged (either by id or by tag). */
  readonly documentIds?: readonly string[];
  readonly tag?: string;
}
