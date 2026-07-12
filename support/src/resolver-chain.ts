/**
 * @file resolver-chain.ts
 * @module @stackra/support
 * @description Ordered chain of resolvers executed until one returns a value.
 *   Used by the navigation system's icon resolver and other packages
 *   needing priority-ordered fallback resolution.
 */

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Generic resolver contract.
 *
 * Resolves a value of type T from a key string. Returns undefined if
 * the resolver cannot handle the key.
 */
export interface IResolver<T = unknown> {
  /** Resolve a value from the given key. */
  resolve(key: string, ...args: unknown[]): T | undefined;
}

// ============================================================================
// Chain
// ============================================================================

/** Internal entry with priority. */
interface ChainEntry<T> {
  /** The resolver instance. */
  resolver: IResolver<T>;
  /** Priority for ordering (lower runs first). */
  priority: number;
}

/**
 * Ordered chain of resolvers executed until one returns a value.
 *
 * Resolvers are registered with a priority and called in ascending order.
 * The first resolver to return a non-undefined value wins.
 *
 * @example
 * ```typescript
 * const chain = new ResolverChain<ReactNode>();
 * chain.register(lucideResolver, 10);
 * chain.register(customResolver, 20);
 * const icon = chain.resolve('home');
 * ```
 */
export class ResolverChain<T = unknown> {
  /** Internal sorted list of entries. */
  private entries: ChainEntry<T>[] = [];

  /** Whether the chain needs re-sorting. */
  private dirty = false;

  /**
   * Register a resolver with a priority.
   *
   * @param resolver - The resolver to register
   * @param priority - Priority (lower runs first). Default: 50.
   */
  public register(resolver: IResolver<T>, priority = 50): void {
    this.entries.push({ resolver, priority });
    this.dirty = true;
  }

  /**
   * Resolve by running resolvers in priority order until one returns.
   *
   * @param key - The key to resolve
   * @param args - Additional arguments passed to each resolver
   * @returns The resolved value or undefined if none matched
   */
  public resolve(key: string, ...args: unknown[]): T | undefined {
    if (this.dirty) {
      this.entries.sort((a, b) => a.priority - b.priority);
      this.dirty = false;
    }

    for (const entry of this.entries) {
      const result = entry.resolver.resolve(key, ...args);
      if (result !== undefined) return result;
    }
    return undefined;
  }
}
