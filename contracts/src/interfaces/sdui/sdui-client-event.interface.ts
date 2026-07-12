/**
 * @file sdui-client-event.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Client-side event emitted by an action response. The
 *   renderer forwards each event to `@stackra/realtime` so other tabs
 *   / devices see the update.
 */

/**
 * One cross-tab client event. The renderer hands it to
 * `RealtimeManager.emit(name, payload)`.
 */
export interface ISduiClientEvent {
  /**
   * Event name (e.g. `'order.refunded'`, `'cart.updated'`). Keep
   * names in dot-separated lowercase to stay consistent with the
   * backend event catalog.
   */
  readonly name: string;

  /** Event payload — must be JSON-serializable. */
  readonly payload?: unknown;
}
