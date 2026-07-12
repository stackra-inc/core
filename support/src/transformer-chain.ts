/**
 * @file transformer-chain.ts
 * @module @stackra/support
 * @description Ordered chain of transformers executed sequentially by priority.
 *   Used by the navigation system's menu transformer pipeline and other
 *   packages needing priority-ordered data transformation.
 */

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Generic transformer contract.
 *
 * Transforms input data of type T using an optional context of type C.
 */
export interface ITransformer<T, C = unknown> {
  /** Transform the input using the provided context. */
  transform(input: T, context: C): T;
}

// ============================================================================
// Chain
// ============================================================================

/** Internal entry with priority. */
interface ChainEntry<T, C> {
  /** The transformer instance. */
  transformer: ITransformer<T, C>;
  /** Priority for ordering (lower runs first). */
  priority: number;
}

/**
 * Ordered chain of transformers executed sequentially.
 *
 * Transformers are registered with a numeric priority and executed in
 * ascending order. Each transformer receives the output of the previous one.
 *
 * @example
 * ```typescript
 * const chain = new TransformerChain<string[], TransformContext>();
 * chain.register(myTransformer, 10);
 * const result = chain.run(items, context);
 * ```
 */
export class TransformerChain<T, C = unknown> {
  /** Internal sorted list of entries. */
  private entries: ChainEntry<T, C>[] = [];

  /** Whether the chain needs re-sorting. */
  private dirty = false;

  /**
   * Register a transformer with a priority.
   *
   * @param transformer - The transformer to register
   * @param priority - Priority (lower runs first). Default: 50.
   */
  public register(transformer: ITransformer<T, C>, priority = 50): void {
    this.entries.push({ transformer, priority });
    this.dirty = true;
  }

  /**
   * Execute all transformers in priority order.
   *
   * @param input - The initial input to transform
   * @param context - The context passed to each transformer
   * @returns The final transformed output
   */
  public run(input: T, context: C): T {
    if (this.dirty) {
      this.entries.sort((a, b) => a.priority - b.priority);
      this.dirty = false;
    }

    let result = input;
    for (const entry of this.entries) {
      result = entry.transformer.transform(result, context);
    }
    return result;
  }

  /**
   * Get all registered transformers ordered by priority.
   *
   * @returns Ordered array of transformer instances
   */
  public getOrdered(): ITransformer<T, C>[] {
    if (this.dirty) {
      this.entries.sort((a, b) => a.priority - b.priority);
      this.dirty = false;
    }
    return this.entries.map((e) => e.transformer);
  }
}
