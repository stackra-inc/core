/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/redis
 * @description Barrel export for Redis interfaces.
 */
export type {
  IRedisClient,
  ISetOptions,
  RedisPipelineResult,
  IRedisPipeline,
  IRedisTransaction,
  IRedisBackend,
  RedisClientConfig,
  IIoredisStandaloneConfig,
  IIoredisClusterConfig,
  IIoredisSentinelConfig,
  IUpstashClientConfig,
} from './redis-client.interface';
export type {
  IRedisManager,
  IRedisModuleOptions,
  IRedisModuleAsyncOptions,
} from './redis-manager.interface';
export type { IRedisSubscriber, IRedisSubscriberEventMap } from './redis-subscriber.interface';
export type { IRedisSerializer } from './redis-serializer.interface';
export type { IRedisScriptRegistry } from './redis-script-registry.interface';
export type { IRedisTagManager } from './redis-tag-manager.interface';
export type { IStreamMessage, IStreamProducer, IStreamConsumer } from './redis-stream.interface';
export type { ILockOptions, ILimiterResult, IRedisLock, ILockResult } from './redis-lock.interface';
export type {
  IRedisEventBase,
  IRedisConnectedPayload,
  IRedisDisconnectedPayload,
  IRedisErrorPayload,
  IRedisReconnectingPayload,
  IRedisLockAcquiredPayload,
  IRedisLockReleasedPayload,
  IRedisCommandExecutedPayload,
  IRedisCommandFailedPayload,
  IRedisStreamMessageReceivedPayload,
  IRedisStreamMessageAcknowledgedPayload,
} from './redis-event-payloads.interface';
