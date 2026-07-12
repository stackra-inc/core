/**
 * @file health-indicator.interface.ts
 * @module @stackra/contracts/interfaces/health
 * @description Health indicator contract.
 */

/** Health check status values. */
export enum HealthStatus {
  UP = 'up',
  DOWN = 'down',
  DEGRADED = 'degraded',
  UNKNOWN = 'unknown',
}

/** Kubernetes probe types. */
export enum HealthProbe {
  LIVENESS = 'liveness',
  READINESS = 'readiness',
  STARTUP = 'startup',
}

/** Result shape from a single health probe check. */
export interface HealthProbeResult {
  status: HealthStatus;
  message?: string;
  details?: Record<string, unknown>;
  duration?: number;
  [key: string]: unknown;
}

/** Result from a health indicator. */
export type HealthIndicatorResult = Record<string, HealthProbeResult>;

/** Aggregated health result across all indicators. */
export interface IAggregatedHealthResult {
  status: HealthStatus;
  info: HealthIndicatorResult;
  error: HealthIndicatorResult;
  details: HealthIndicatorResult;
  results?: HealthIndicatorResult;
  timestamp?: string;
  duration?: number;
}

/** Individual health check result for a single indicator. */
export interface IHealthResult {
  /** Indicator name. */
  name: string;
  /** Health status. */
  status: HealthStatus;
  /** Result from the indicator. */
  result: HealthIndicatorResult;
  /** Duration in milliseconds. */
  duration: number;
  /** When the check started. */
  startedAt?: Date;
  /** When the check ended. */
  endedAt?: Date;
  /** Additional metadata. */
  metadata?: Record<string, unknown>;
  /** Optional message from the indicator. */
  message?: string;
  /** Allow additional properties. */
  [key: string]: unknown;
}

/** Contract for health check indicators. */
export interface IHealthIndicator {
  /** Name of this health indicator (e.g., 'database', 'redis'). */
  name: string;
  /** Execute the health check. */
  check(): Promise<HealthIndicatorResult>;
}

/** Contract for health result persistence. */
export interface IResultStore {
  /** Store a health check result. */
  store(result: IAggregatedHealthResult): Promise<void>;
  /** Retrieve the last stored result. */
  getLatest(): Promise<IAggregatedHealthResult | null>;
}

/** Contract for health metrics reporting. */
export interface IHealthMetrics {
  /** Record a health check duration. */
  recordDuration(indicator: string, durationMs: number): void;
  /** Record a health status change. */
  recordStatusChange(indicator: string, status: HealthStatus): void;
}

/** Event payload when an indicator's status changes. */
export interface IIndicatorStatusEvent {
  /** Indicator name. */
  name: string;
  /** Previous status. */
  previousStatus: HealthStatus;
  /** New status. */
  currentStatus: HealthStatus;
  /** Timestamp of the change. */
  timestamp: string;
  /** Allow additional properties. */
  [key: string]: unknown;
}

/** Event payload when overall system status changes. */
export interface ISystemStatusEvent {
  /** Previous overall status. */
  previousStatus: HealthStatus;
  /** New overall status. */
  currentStatus: HealthStatus;
  /** Timestamp of the change. */
  timestamp: string;
  /** Individual indicator results at the time of change. */
  results: HealthIndicatorResult;
  /** Allow additional properties. */
  [key: string]: unknown;
}
