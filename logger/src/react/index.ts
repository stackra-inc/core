/**
 * @file index.ts
 * @module @stackra/logger/react
 * @description React bindings for the logger system.
 *   Provides hooks for creating context-bound loggers in components,
 *   an error boundary for automatic error logging, and client-side
 *   reporters (HTTP batching, network error capture).
 */

// ============================================================================
// Hooks
// ============================================================================
export { useLogger } from './hooks/use-logger/use-logger.hook';
export { useLoggerChannel } from './hooks/use-logger-channel/use-logger-channel.hook';

// ============================================================================
// Components
// ============================================================================
export { LoggerErrorBoundary } from './components/logger-error-boundary.component';
export type { ILoggerErrorBoundaryProps } from './components/logger-error-boundary-props.interface';

// ============================================================================
// Reporters
// ============================================================================
export { HttpReporter } from './reporters/http.reporter';
export { NetworkCaptureReporter } from './reporters/network-capture.reporter';
