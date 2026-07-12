/**
 * @file redis-stream.interface.ts
 * @module @stackra/contracts/interfaces/redis
 * @description Redis Streams contracts.
 */

/** A message from a Redis Stream. */
export interface IStreamMessage {
  id: string;
  data?: Record<string, string>;
  /** Raw field values from the stream entry. */
  fields?: Record<string, string>;
  /** The stream this message came from. */
  stream?: string;
  /** Acknowledge this message (mark as processed). */
  ack?(): Promise<void>;
}

/** Redis Stream producer contract. */
export interface IStreamProducer {
  add(stream: string, data: Record<string, string>): Promise<string>;
}

/** Redis Stream consumer contract. */
export interface IStreamConsumer {
  /** Read pending messages from a consumer group. */
  read(stream: string, group: string, options?: unknown): Promise<IStreamMessage[]>;
  /** Acknowledge messages. */
  ack(stream: string, group: string, ids: string[]): Promise<number>;
  /** Create a consumer group for a stream. */
  createGroup?(stream: string, group: string, startId?: string): Promise<boolean>;
}
