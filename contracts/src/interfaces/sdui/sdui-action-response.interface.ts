/**
 * @file sdui-action-response.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Envelope returned by every action invocation. The
 *   renderer dispatches on `ok` and applies any side effects
 *   (toast, document patch, redirect, notification).
 */

import type { TranslatableText } from '../../types/sdui/translatable-text.type';
import type { ISduiClientEvent } from './sdui-client-event.interface';
import type { ISduiNotificationDescriptor } from './sdui-notification-descriptor.interface';
import type { ISduiToastDescriptor } from './sdui-toast-descriptor.interface';
import type { SduiSlotContent } from './sdui-slot-content.interface';
import type { ISduiDocument } from './sdui-document.interface';

/**
 * Error block returned when an action fails. Carries a typed code
 * plus an optional `fields` map for per-field 422 validation errors
 * the form renderer surfaces.
 */
export interface ISduiActionError {
  /** Typed error code (e.g. `'validation-failed'`, `'rate-limit-exceeded'`). */
  readonly code: string;
  /** Translated message shown to the user. */
  readonly message: TranslatableText;
  /** Optional field-level errors keyed by form path. */
  readonly fields?: Readonly<Record<string, readonly string[]>>;
  /** Optional `Retry-After` hint for rate-limit errors (seconds). */
  readonly retryAfter?: number;
}

/**
 * Audit record returned for traceability. The executor also writes
 * this to `@stackra/audit` (when present) — this echo lets the
 * renderer log it without a second round trip.
 */
export interface ISduiAuditRecord {
  /** Stable id (typically a UUID). */
  readonly id: string;
  /** Action type that was invoked. */
  readonly actionType: string;
  /** Time the audit record was created (ISO 8601). */
  readonly recordedAt: string;
  /** Duration of the handle invocation in milliseconds. */
  readonly durationMs?: number;
}

/**
 * Full response envelope for one action invocation.
 */
export interface ISduiActionResponse<TOutput = unknown> {
  /** True when the handler returned successfully. */
  readonly ok: boolean;

  /** Handler return value when `ok === true`. */
  readonly output?: TOutput;

  /** Error block when `ok === false`. */
  readonly error?: ISduiActionError;

  /** Inline toast pushed onto the toast slot. */
  readonly toast?: ISduiToastDescriptor;

  /**
   * Notification dispatched through `@stackra/nestjs-notifications`
   * for channels other than `'toast'`. The executor handles the
   * channel routing; the renderer renders the inline toast (when
   * present in `channels`).
   */
  readonly notification?: ISduiNotificationDescriptor;

  /** Replace the current document wholesale with this one. */
  readonly nextDocument?: ISduiDocument;

  /**
   * Patch slots on the current document without full reload. Keyed
   * by slot name; the renderer merges these into the active document.
   */
  readonly nextSlots?: Readonly<Record<string, SduiSlotContent>>;

  /**
   * Cross-tab client events. Each is forwarded to
   * `@stackra/realtime` so other tabs / devices see the update.
   */
  readonly events?: readonly ISduiClientEvent[];

  /** Optional audit record echo. */
  readonly audit?: ISduiAuditRecord;
}
