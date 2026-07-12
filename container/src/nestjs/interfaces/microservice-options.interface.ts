/**
 * @file microservice-options.interface.ts
 * @module @stackra/container/src/interfaces
 * @description IMicroserviceOptions interface.
 */

import type { IApplicationOptions } from './application-options.interface';

/** Supported microservice transport types. */
export type MicroserviceTransport = 'tcp' | 'redis' | 'nats' | 'mqtt' | 'grpc' | 'kafka' | 'rmq';

/** TCP transport options. */
export interface ITcpTransportOptions {
  host?: string;
  port?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

/** Redis transport options. */
export interface IRedisTransportOptions {
  host?: string;
  port?: number;
  password?: string;
  retryAttempts?: number;
  retryDelay?: number;
}

/** NATS transport options. */
export interface INatsTransportOptions {
  url?: string;
  servers?: string[];
  user?: string;
  pass?: string;
  queue?: string;
}

/** Kafka transport options. */
export interface IKafkaTransportOptions {
  client?: { brokers?: string[]; clientId?: string };
  consumer?: { groupId?: string };
  producer?: Record<string, unknown>;
}

/** gRPC transport options. */
export interface IGrpcTransportOptions {
  package?: string | string[];
  protoPath?: string | string[];
  url?: string;
}

/** RabbitMQ transport options. */
export interface IRmqTransportOptions {
  urls?: string[];
  queue?: string;
  queueOptions?: { durable?: boolean };
  prefetchCount?: number;
}

/** MQTT transport options. */
export interface IMqttTransportOptions {
  url?: string;
  username?: string;
  password?: string;
}

/** Connection options for a single microservice transport. */
export interface IMicroserviceConnectionOptions {
  /** Transport type. */
  transport: MicroserviceTransport;
  /** Transport-specific connection options. */
  options?: Record<string, unknown>;
}

/**
 * Options for Microservice mode.
 *
 * A microservice can be standalone (no HTTP) or hybrid (HTTP + microservice listeners).
 */
export interface IMicroserviceOptions {
  /** Microservice connection(s). Supports multiple transports simultaneously. */
  connections: IMicroserviceConnectionOptions | IMicroserviceConnectionOptions[];
  /** If true, also start an HTTP server (hybrid mode). Default: false */
  hybrid?: boolean;
  /** HTTP options when hybrid mode is enabled. */
  httpOptions?: Partial<IApplicationOptions>;
  /** NestJS log levels. Default: ['error', 'warn', 'log'] */
  logLevels?: string[];
  /** Graceful shutdown timeout in ms. Default: 10000 */
  shutdownTimeout?: number;
}
