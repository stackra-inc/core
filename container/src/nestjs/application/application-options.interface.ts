/**
 * @file application-options.interface.ts
 * @module @stackra/container/nestjs
 * @description Re-exports application option interfaces from the central interfaces directory.
 */

export type {
  IApplicationOptions,
  ICorsOptions,
  IValidationOptions,
  ISwaggerOptions,
  IShutdownOptions,
  IVersioningOptions,
} from '../interfaces/application-options.interface';

export type { ICliOptions } from '../interfaces/cli-options.interface';
export type { IWorkerOptions } from '../interfaces/worker-options.interface';
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
} from '../interfaces/microservice-options.interface';
