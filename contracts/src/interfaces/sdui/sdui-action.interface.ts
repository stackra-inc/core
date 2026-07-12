/**
 * @file sdui-action.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Contract for an action handler. Action handlers
 *   implement the Filament-style lifecycle (`beforeFormFilled →
 *   afterFormFilled → before → handle → after → lifecycleAfter`)
 *   and are auto-discovered via `@SduiAction()`.
 */

import type { ISduiActionDescriptor } from './sdui-action-descriptor.interface';
import type { ISduiActionResponse } from './sdui-action-response.interface';

/**
 * Runtime context handed to every action lifecycle hook. The
 * platform supplies it; handlers only read.
 */
export interface ISduiActionContext {
  /** Resource name producing the action (omitted for page-level actions). */
  readonly resource?: string;
  /** Path params from the request (`:id`, `:slug`, …). */
  readonly params: Readonly<Record<string, unknown>>;
  /** Query params from the request. */
  readonly query: Readonly<Record<string, unknown>>;
  /** Scope context (owner, role, locale). Loose-typed to avoid coupling. */
  readonly scope: Readonly<Record<string, unknown>>;
  /** Locale code (BCP-47). */
  readonly locale: string;
  /** Authenticated user record (loose-typed). */
  readonly user?: Readonly<Record<string, unknown>>;
  /**
   * Descriptor that triggered this invocation. Carries the
   * permissions, rate-limit policy, form schema reference, and
   * keyboard binding.
   */
  readonly descriptor: ISduiActionDescriptor;
  /**
   * Module configuration snapshot — surfaces auth mount paths and
   * other config the handler may need without injecting them
   * everywhere.
   */
  readonly config?: Readonly<Record<string, unknown>>;
}

/**
 * Contract for a SDUI action handler. Auto-discovered through
 * `@SduiAction()` and invoked by `ActionExecutorService`.
 *
 * Lifecycle order:
 *   1. `schema()` → validate input
 *   2. `beforeFormFilled()` → prepare any pre-form data
 *   3. `afterFormFilled()` → reshape input after the form closes
 *   4. `requiresConfirmation()` → renderer prompts the user
 *   5. `before()` → side-effect-free pre-flight (e.g. business rules)
 *   6. `handle()` → the core mutation
 *   7. `after()` → emit domain events, refresh caches
 *   8. `lifecycleAfter()` → catch-all observer (audit, telemetry)
 */
export interface ISduiActionHandler<TInput = unknown, TOutput = unknown> {
  /** Handler identifier — matches the descriptor `type` field. */
  readonly type: string;

  /**
   * Optional Zod schema describing the modal form for the action.
   * Loose-typed `unknown` so contracts has no Zod dependency.
   */
  schema?(): unknown;

  /**
   * Returns `true` when the renderer should prompt with the
   * documented confirmation dialog before invoking `handle()`.
   */
  requiresConfirmation?(ctx: ISduiActionContext): boolean;

  /**
   * Optional pre-form hook — runs before the modal form opens. Use
   * to prefetch field options or warm caches.
   */
  beforeFormFilled?(ctx: ISduiActionContext): Promise<void> | void;

  /**
   * Optional after-form hook — runs after the form values are
   * collected but before `before()`. Use to derive computed input.
   */
  afterFormFilled?(input: TInput, ctx: ISduiActionContext): Promise<void> | void;

  /**
   * Optional pre-flight hook — runs after validation but before the
   * handler. Throw a typed error to abort.
   */
  before?(input: TInput, ctx: ISduiActionContext): Promise<void> | void;

  /**
   * Main entry point. Performs the actual work and returns either a
   * raw output or a full `ISduiActionResponse` envelope.
   */
  handle(input: TInput, ctx: ISduiActionContext): Promise<TOutput | ISduiActionResponse<TOutput>>;

  /**
   * Optional post-handler hook — runs after `handle()` returns.
   * Used to emit domain events, broadcast realtime updates, etc.
   */
  after?(output: TOutput, ctx: ISduiActionContext): Promise<void> | void;

  /**
   * Catch-all observer that fires after every successful action
   * regardless of how `after()` finishes. Use for audit / telemetry.
   */
  lifecycleAfter?(output: TOutput, ctx: ISduiActionContext): Promise<void> | void;
}
