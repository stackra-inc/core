/**
 * @file index.ts
 * @module @stackra/queue/core/constants
 * @description Barrel export for queue constants.
 */

// ── DI Tokens + Event Names (re-exported from contracts) ──
export {
  QUEUE_MANAGER,
  QUEUE_CONFIG,
  PROCESSOR_METADATA_KEY,
  ON_JOB_EVENT_METADATA_KEY,
  QUEUE_EVENTS,
} from '@stackra/contracts';

// ── Defaults ──
export const DEFAULT_QUEUE_CONNECTION = 'default' as const;
export { DEFAULT_QUEUE_CONFIG } from './default-queue-config.constant';
