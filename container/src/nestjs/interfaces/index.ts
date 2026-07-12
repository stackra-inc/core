/**
 * @file index.ts
 * @module @stackra/container/nestjs/interfaces
 * @description Barrel re-exports for the interfaces directory.
 */
export type {
  IApplicationOptions,
  ICorsOptions,
  IValidationOptions,
  ISwaggerOptions,
  IShutdownOptions,
  IVersioningOptions,
} from './application-options.interface';
export type { ICliOptions } from './cli-options.interface';
export type {
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
} from './microservice-options.interface';
export type { IWorkerOptions } from './worker-options.interface';
