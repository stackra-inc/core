/**
 * @file redis-subscriber.interface.ts
 * @module @stackra/contracts/interfaces/redis
 * @description Redis pub/sub subscriber contract.
 */

/** Event map for Redis subscriber. */
export interface IRedisSubscriberEventMap<TMessage = string> {
  message: (channel: string, message: TMessage) => void;
  pmessage: (pattern: string, channel: string, message: TMessage) => void;
  subscribe: (channel: string, count: number) => void;
  unsubscribe: (channel: string, count: number) => void;
  [key: string]: (...args: any[]) => void;
}

/** Redis subscriber contract. */
export interface IRedisSubscriber<TMessage = string> {
  subscribe(...channels: string[]): Promise<void> | void;
  psubscribe(...patterns: string[]): Promise<void> | void;
  unsubscribe(...channels: string[]): Promise<void> | void;
  on(event: string, listener: (...args: any[]) => void): void;
}
