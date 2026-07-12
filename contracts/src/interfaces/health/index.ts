/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/health
 * @description Barrel export for health check interfaces.
 */

export {
  HealthStatus,
  HealthProbe,
  type HealthProbeResult,
  type HealthIndicatorResult,
  type IAggregatedHealthResult,
  type IHealthResult,
  type IHealthIndicator,
  type IResultStore,
  type IHealthMetrics,
  type IIndicatorStatusEvent,
  type ISystemStatusEvent,
} from './health-indicator.interface';
