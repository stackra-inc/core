/**
 * @file sdui-cross-cutting-payloads.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Typed payloads for cross-cutting SDUI events dispatched
 *   by `SduiEventDispatcher` — notifications, imports, exports,
 *   rate-limit rejections, and toast closures.
 *
 *   These duplicate the interfaces exported from
 *   `@stackra/sdui/nestjs/services/sdui-event-dispatcher.service`
 *   so cross-package `@OnEvent` consumers can type their handlers
 *   without importing from the SDUI runtime.
 */

/**
 * Payload for `SDUI_EVENTS.NOTIFICATION_CREATED` — a notification
 * descriptor was persisted and dispatched to its channel.
 */
export interface ISduiNotificationCreatedPayload {
  /** Free-form notification descriptor id. */
  readonly notificationId: string;
  /** Notification channel selected by the dispatcher (`email`, `sms`, ...). */
  readonly channel: string;
  /** Optional caller-supplied metadata forwarded to listeners. */
  readonly metadata?: Readonly<Record<string, unknown>>;
}

/**
 * Payload for `SDUI_EVENTS.IMPORT_QUEUED` and
 * `SDUI_EVENTS.IMPORT_COMPLETED`.
 */
export interface ISduiImportPayload {
  /** Data-transfer job id assigned when the import was queued. */
  readonly jobId: string;
  /** Resource type the import targets (e.g. `'customers'`). */
  readonly resource: string;
  /** Row count when known — undefined at queue time, present on completion. */
  readonly rowCount?: number;
  /** Error message when the emission represents a failed completion. */
  readonly error?: string;
}

/**
 * Payload for `SDUI_EVENTS.EXPORT_QUEUED` and
 * `SDUI_EVENTS.EXPORT_COMPLETED`.
 */
export interface ISduiExportPayload {
  /** Data-transfer job id assigned when the export was queued. */
  readonly jobId: string;
  /** Resource type the export targets. */
  readonly resource: string;
  /** Row count exported when the completion event fires. */
  readonly rowCount?: number;
  /** URL of the generated file on completion. */
  readonly downloadUrl?: string;
  /** Error message when the emission represents a failed completion. */
  readonly error?: string;
}

/**
 * Payload for `SDUI_EVENTS.RATE_LIMIT_EXCEEDED`.
 */
export interface ISduiRateLimitExceededPayload {
  /** Action type that tripped the limiter. */
  readonly actionType: string;
  /** Actor id when known (user, tenant, api key). */
  readonly actorId?: string;
  /** Retry-After hint in seconds so client UIs can display a countdown. */
  readonly retryAfterSeconds: number;
}

/**
 * Payload for `SDUI_EVENTS.TOAST_CLOSED`.
 */
export interface ISduiToastClosedPayload {
  /** Client-generated toast id. */
  readonly toastId: string;
  /** Reason the toast was dismissed. */
  readonly reason: 'user' | 'timeout';
}
