/**
 * @file events.constant.ts
 * @module @stackra/coordinator/core/constants
 * @description Local re-export of the canonical coordinator event
 *   constants. The names live in `@stackra/contracts` so cross-package
 *   listeners (failover orchestrators, telemetry collectors, UI
 *   indicators) can subscribe without depending on
 *   `@stackra/coordinator` directly.
 */

export { COORDINATOR_EVENTS } from '@stackra/contracts';
