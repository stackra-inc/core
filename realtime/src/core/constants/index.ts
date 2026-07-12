/**
 * @file index.ts
 * @module @stackra/realtime/core/constants
 * @description DI tokens and event-name constants for the realtime
 *   subsystem. Canonical tokens live in `@stackra/contracts`; this
 *   file re-exports them for local convenience.
 */

// ============================================================================
// DI Tokens (canonical source: @stackra/contracts)
// ============================================================================

export { REALTIME_MANAGER, REALTIME_CONFIG } from '@stackra/contracts';

// ============================================================================
// Event Names (canonical source: @stackra/contracts)
// ============================================================================

/** Realtime lifecycle events emitted via EventEmitter. */
export { REALTIME_EVENTS } from '@stackra/contracts';
export { DEFAULT_REALTIME_CONFIG } from './default-realtime-config.constant';
