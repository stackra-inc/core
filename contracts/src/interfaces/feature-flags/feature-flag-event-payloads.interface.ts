/**
 * @file feature-flag-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/feature-flags
 * @description Typed payloads for every constant in `FEATURE_FLAG_EVENTS`.
 */

/**
 * Payload for `FEATURE_FLAG_EVENTS.FLAG_REGISTERED` — a flag
 * definition was inserted into the registry at boot time.
 */
export interface IFeatureFlagRegisteredPayload {
  /** Flag key. */
  readonly flag: string;
  /**
   * The registered flag definition. Loose-typed because the
   * concrete shape lives in `@stackra/feature-flags` and contracts
   * doesn't depend on the downstream package.
   */
  readonly definition: unknown;
}

/**
 * Payload for `FEATURE_FLAG_EVENTS.FLAG_EVALUATED` — a flag was
 * resolved for a given context (with or without cache hit).
 */
export interface IFeatureFlagEvaluatedPayload {
  /** Flag key that was evaluated. */
  readonly flag: string;
  /** Resolved boolean. */
  readonly enabled: boolean;
  /** Source that answered the evaluation. */
  readonly source: 'cache' | 'scope' | 'static' | string;
  /** Optional caller identifier used for percentage rollout. */
  readonly identifier?: string;
  /** Optional scope node id used in the evaluation. */
  readonly nodeId?: string;
  /** Optional owner id used in the evaluation. */
  readonly ownerId?: string;
}

/**
 * Payload for `FEATURE_FLAG_EVENTS.FLAG_TOGGLED` — a mutable store
 * flipped a flag's resolved value at runtime (create / update /
 * delete via the REST API or the FlagStore).
 */
export interface IFeatureFlagToggledPayload {
  /** Flag key that changed. */
  readonly flag: string;
  /** New resolved value. */
  readonly enabled: boolean;
  /** Previous resolved value (undefined on first registration). */
  readonly previous?: boolean;
}
