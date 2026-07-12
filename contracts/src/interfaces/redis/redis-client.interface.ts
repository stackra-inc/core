/**
 * @file redis-client.interface.ts
 * @module @stackra/contracts/interfaces/redis
 * @description Redis client contract.
 */

/** Options for the SET command. */
export interface ISetOptions {
  /** Expire time in seconds. */
  ex?: number;
  /** Expire time in milliseconds. */
  px?: number;
  /** Only set if key doesn't exist. */
  nx?: boolean;
  /** Only set if key exists. */
  xx?: boolean;
}

/** Redis pipeline result entry. */
export type RedisPipelineResult = [error: Error | null, result: unknown];

/** Redis pipeline interface. */
export interface IRedisPipeline {
  get(key: string): this;
  set(key: string, value: string, options?: ISetOptions | unknown): this;
  del(...keys: string[]): this;
  sadd(key: string, ...members: string[]): this;
  srem(key: string, ...members: string[]): this;
  expire(key: string, seconds: number): this;
  incr(key: string): this;
  decr(key: string): this;
  exec(): Promise<RedisPipelineResult[] | unknown>;
  [key: string]: unknown;
}

/** Redis transaction interface. */
export interface IRedisTransaction extends IRedisPipeline {
  exec(): Promise<RedisPipelineResult[]>;
}

/** Redis client contract — wraps ioredis or Upstash HTTP. */
export interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: ISetOptions | number): Promise<string | void>;
  del(...keys: string[]): Promise<number>;
  exists(...keys: string[]): Promise<number>;
  expire(key: string, seconds: number): Promise<number | boolean>;
  ttl(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  decr(key: string): Promise<number>;
  incrby(key: string, increment: number): Promise<number>;
  decrby(key: string, decrement: number): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  flushdb(): Promise<string | void>;
  ping(): Promise<string>;
  /** Multi-get multiple keys at once. */
  mget(...keys: string[]): Promise<(string | null)[]>;
  /** Hash get. */
  hget(key: string, field: string): Promise<string | null>;
  /** Hash set. */
  hset(key: string, field: string, value: string): Promise<number>;
  /**
   * Get ALL field/value pairs from a hash.
   *
   * Returns an empty object when the key does not exist. Field
   * iteration order is implementation-defined — do not rely on it
   * for correctness. Use a companion LIST when ordering matters
   * (the workflow datastore uses this pattern for step records).
   */
  hgetall(key: string): Promise<Record<string, string>>;
  /** Set members. */
  smembers(key: string): Promise<string[]>;
  /**
   * Append one or more values to the tail of a list. Returns the new
   * length of the list. The list is created if it does not exist.
   *
   * Variadic so consumers can push multiple values in one round-trip.
   */
  rpush(key: string, ...values: string[]): Promise<number>;
  /**
   * Read a slice of a list by index range.
   *
   * `start` and `stop` follow Redis semantics: `0` is the head,
   * `-1` is the tail (inclusive). Returns the empty array when the
   * key does not exist.
   */
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  /** Scan keys. */
  scan(cursor: number, options?: { match?: string; count?: number }): Promise<[number, string[]]>;
  /** Create a pipeline for batching commands. */
  pipeline(): IRedisPipeline;
  /** Execute a Lua script by SHA. */
  evalsha(...args: unknown[]): Promise<unknown>;
  /** Execute a Lua script. */
  eval(...args: unknown[]): Promise<unknown>;
  /** Disconnect the client. */
  disconnect?(): Promise<void>;
  /** Get the connection name/identifier. */
  getName?(): string;
}

/** Redis backend interface. */
export interface IRedisBackend {
  /** Backend name (e.g., 'ioredis', 'upstash'). */
  name: string;
  /** Create a client from configuration. */
  createClient(config: Record<string, unknown>): IRedisClient | Promise<IRedisClient>;
}

/** Redis client configuration (union type for different backends). */
export type RedisClientConfig = Record<string, unknown>;

/** ioredis standalone connection config. */
export interface IIoredisStandaloneConfig {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  [key: string]: unknown;
}

/** ioredis cluster connection config. */
export interface IIoredisClusterConfig {
  nodes: Array<{ host: string; port: number }>;
  options?: Record<string, unknown>;
  [key: string]: unknown;
}

/** ioredis sentinel connection config. */
export interface IIoredisSentinelConfig {
  sentinels: Array<{ host: string; port: number }>;
  name: string;
  [key: string]: unknown;
}

/** Upstash HTTP client config. */
export interface IUpstashClientConfig {
  url: string;
  token: string;
  [key: string]: unknown;
}
