/**
 * @file index.ts
 * @module @stackra/container/nestjs/application
 * @description Application bootstrap barrel.
 *   Re-exports all public symbols for the enterprise application layer.
 */

// ============================================================================
// Application
// ============================================================================
export { Application } from './application';
export { ApplicationBuilder } from './application-builder';
export type {
  IApplicationOptions,
  ICorsOptions,
  IValidationOptions,
  ISwaggerOptions,
  IShutdownOptions,
  IVersioningOptions,
  ICliOptions,
  IWorkerOptions,
  IMicroserviceOptions,
  IMicroserviceConnectionOptions,
  MicroserviceTransport,
  ITcpTransportOptions,
  IRedisTransportOptions,
  INatsTransportOptions,
  IKafkaTransportOptions,
  IGrpcTransportOptions,
  IRmqTransportOptions,
  IMqttTransportOptions,
} from './application-options.interface';

// ============================================================================
// Middleware
// ============================================================================
export { RequestIdMiddleware, CorrelationIdMiddleware, RawBodyMiddleware } from './middleware';

// ============================================================================
// Interceptors
// ============================================================================
export { TimeoutInterceptor } from './interceptors';

// ============================================================================
// Filters
// ============================================================================
export { AllExceptionsFilter, HttpExceptionFilter, ValidationExceptionFilter } from './filters';

// ============================================================================
// Pipes
// ============================================================================
export { TrimPipe, StripHtmlPipe } from './pipes';
