/**
 * @file redis-script-registry.interface.ts
 * @module @stackra/contracts/interfaces/redis
 * @description Redis Lua script registry contract.
 */

/** Redis Lua script registry — register and execute scripts by name. */
export interface IRedisScriptRegistry {
  register(name: string, script: string): void;
  execute<T = unknown>(
    name: string,
    keys: string[],
    args: (string | number)[],
    connectionName?: string
  ): Promise<T>;
}
