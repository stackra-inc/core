/**
 * @file redis-serializer.interface.ts
 * @module @stackra/contracts/interfaces/redis
 * @description Redis value serializer contract.
 */

/** Redis serializer — encode/decode values for storage. */
export interface IRedisSerializer {
  /** Serialize a value to string for Redis storage. */
  serialize(value: unknown): string;
  /** Deserialize a string from Redis back to a value. */
  deserialize(raw: string | Buffer): unknown;
  /** Optional: get the format name (e.g., 'json', 'msgpack'). */
  getFormat?(): string;
}
