/**
 * @file middleware-resolver.service.ts
 * @module @stackra/ssr/middleware/services
 * @description Produces the final ordered middleware chain for a given
 *   route resolution input.
 *
 *   Steps (in order):
 *     1. Collect candidates — global + groups + route.
 *     2. Environment filter — drop entries whose `runOn` doesn't match.
 *     3. Enabled filter    — invoke the `enabled` predicate (once per resolution).
 *     4. Stage filter      — drop mismatched stages (strict for route entries).
 *     5. Reference resolve — look up strings and reify against the registry.
 *     6. Build DAG         — nodes = middleware, edges = `dependsOn`.
 *     7. Cycle detection   — Kahn's algorithm; unresolved nodes throw.
 *     8. Priority sort     — descending priority, tie-broken by declaration.
 *     9. Attach metadata   — return `ResolvedMiddleware[]`.
 */

import { Injectable, Inject, Optional } from '@stackra/container';
import type { IApplication, ILoggerManager } from '@stackra/contracts';
import {
  APPLICATION,
  LOGGER_MANAGER,
  MIDDLEWARE_EVENTS,
  MIDDLEWARE_REGISTRY,
} from '@stackra/contracts';

import { MiddlewareRunOn } from '../enums/middleware-run-on.enum';
import { MiddlewareResolutionError } from '../errors/middleware-resolution.error';
import type { MiddlewareOptions } from '../interfaces/middleware-options.interface';
import type { ResolvedMiddleware } from '../interfaces/resolved-middleware.interface';
import type { RouteResolutionInput } from '../interfaces/route-resolution-input.interface';
import type { MiddlewareDefinition } from '../types/middleware-definition.type';
import { MIDDLEWARE_METADATA_KEY } from '../constants/metadata-keys.constant';
import { DEFAULT_PRIORITY, DEFAULT_RUN_ON, DEFAULT_STAGE } from '../constants/defaults.constant';
import { MiddlewareRegistry } from './middleware-registry.service';

/**
 * Minimal event-emitter shape. Middleware events are optional — this
 * type lets the resolver work whether or not `@stackra/events` is
 * present in the container.
 */
interface IEventEmitterSync {
  emit(event: string, payload: unknown): void;
}

const EVENT_EMITTER_TOKEN = Symbol.for('EVENT_EMITTER');

interface Candidate {
  readonly definition: MiddlewareDefinition;
  readonly options: MiddlewareOptions | undefined;
  readonly resolvedName: string;
  readonly declarationIndex: number;
  readonly source: string;
  readonly explicitStage: boolean;
}

/**
 * Middleware resolver service.
 *
 * Injectable and stateless — safe to cache the reference. The registry
 * holds all state; the resolver reads it on every `resolve()` call.
 */
@Injectable()
export class MiddlewareResolver {
  public constructor(
    @Inject(MIDDLEWARE_REGISTRY) private readonly registry: MiddlewareRegistry,
    @Inject(APPLICATION) private readonly container: IApplication,
    @Optional()
    @Inject(LOGGER_MANAGER)
    private readonly loggerManager?: ILoggerManager,
    @Optional()
    @Inject(EVENT_EMITTER_TOKEN)
    private readonly events?: IEventEmitterSync
  ) {}

  /**
   * Produce the ordered middleware chain for the given input.
   *
   * @throws {MiddlewareResolutionError} On unknown reference, cycle,
   *   `enabled()` throw, or stage mismatch on an explicit route entry.
   */
  public resolve(input: RouteResolutionInput): readonly ResolvedMiddleware[] {
    const startedAt = performance.now();

    // 1. Collect candidates.
    const candidates: Candidate[] = [];
    let counter = 0;

    for (const entry of input.global ?? []) {
      candidates.push(this.materialize(entry, 'global', counter++, false));
    }
    for (const groupName of input.groups ?? []) {
      const group = this.registry.getGroup(groupName);
      if (!group) {
        throw new MiddlewareResolutionError(
          `Unknown middleware group "${groupName}".`,
          'MIDDLEWARE_UNKNOWN_REFERENCE',
          { reference: groupName }
        );
      }
      for (const member of group.middleware) {
        candidates.push(this.materialize(member, `group:${group.name}`, counter++, false));
      }
    }
    for (const entry of input.route ?? []) {
      candidates.push(this.materialize(entry, 'route', counter++, true));
    }

    // 2 + 3 + 4 — filter environment, enabled predicate, stage.
    const filtered: Candidate[] = [];
    for (const candidate of candidates) {
      const runOn = candidate.options?.runOn ?? DEFAULT_RUN_ON;
      if (runOn !== MiddlewareRunOn.BOTH && runOn !== input.environment) {
        continue;
      }
      if (candidate.options?.enabled !== undefined) {
        try {
          const enabled =
            typeof candidate.options.enabled === 'function'
              ? candidate.options.enabled(this.container)
              : candidate.options.enabled;
          if (!enabled) continue;
        } catch (error) {
          throw new MiddlewareResolutionError(
            `Middleware "${candidate.resolvedName || '<anonymous>'}" enabled predicate threw.`,
            'MIDDLEWARE_ENABLED_THREW',
            { middlewareName: candidate.resolvedName },
            error
          );
        }
      }

      const stage = candidate.options?.stage ?? DEFAULT_STAGE;
      if (stage !== input.stage) {
        if (candidate.source === 'route' && candidate.explicitStage) {
          throw new MiddlewareResolutionError(
            `Route-attached middleware "${candidate.resolvedName}" declares stage "${stage}" but the current stage is "${input.stage}".`,
            'MIDDLEWARE_STAGE_MISMATCH',
            { middlewareName: candidate.resolvedName, expected: input.stage, actual: stage }
          );
        }
        continue;
      }
      filtered.push(candidate);
    }

    // 6 + 7 + 8 — DAG, cycle detection, priority sort.
    const ordered = this.topoSort(filtered);

    const resolved: ResolvedMiddleware[] = ordered.map((c) => ({
      definition: c.definition,
      name: c.resolvedName,
      priority: c.options?.priority ?? DEFAULT_PRIORITY,
      stage: c.options?.stage ?? DEFAULT_STAGE,
      runOn: c.options?.runOn ?? DEFAULT_RUN_ON,
      source: c.source,
    }));

    // Fire the RESOLVED event — fail-soft if the emitter isn't wired.
    this.emit(MIDDLEWARE_EVENTS.RESOLVED, {
      chain: resolved,
      input,
      durationMs: performance.now() - startedAt,
    });

    return resolved;
  }

  /**
   * Turn a raw entry (definition or string reference) into a `Candidate`.
   * String references are looked up against the registry; unknown names
   * throw `MIDDLEWARE_UNKNOWN_REFERENCE`.
   */
  private materialize(
    entry: MiddlewareDefinition | string,
    source: string,
    declarationIndex: number,
    fromRoute: boolean
  ): Candidate {
    if (typeof entry === 'string') {
      const found = this.registry.get(entry);
      if (!found) {
        throw new MiddlewareResolutionError(
          `Unknown middleware reference "${entry}".`,
          'MIDDLEWARE_UNKNOWN_REFERENCE',
          { reference: entry }
        );
      }
      return {
        definition: found.definition,
        options: found.options,
        resolvedName: found.name,
        declarationIndex,
        source: `${source}:${entry}`,
        explicitStage: fromRoute && Boolean(found.options?.stage),
      };
    }
    const options = this.extractOptions(entry);
    return {
      definition: entry,
      options,
      resolvedName: options?.name ?? '',
      declarationIndex,
      source,
      explicitStage: fromRoute && Boolean(options?.stage),
    };
  }

  /**
   * Extract the options blob from any middleware form.
   */
  private extractOptions(def: MiddlewareDefinition): MiddlewareOptions | undefined {
    if (typeof def === 'function') {
      return Reflect.getMetadata?.(MIDDLEWARE_METADATA_KEY, def) as MiddlewareOptions | undefined;
    }
    if (typeof def === 'object' && def !== null) {
      return def as MiddlewareOptions;
    }
    return undefined;
  }

  /**
   * Priority-aware topological sort. Uses Kahn's algorithm keyed by
   * `(-priority, declarationIndex)` — highest priority first, ties
   * broken by original declaration order.
   *
   * @throws {MiddlewareResolutionError} If a cycle is detected.
   */
  private topoSort(candidates: readonly Candidate[]): Candidate[] {
    if (candidates.length === 0) return [];

    // Build the adjacency and in-degree tables.
    const byName = new Map<string, Candidate>();
    for (const c of candidates) {
      if (c.resolvedName) byName.set(c.resolvedName, c);
    }

    const inDegree = new Map<Candidate, number>();
    const dependents = new Map<Candidate, Set<Candidate>>();
    for (const c of candidates) {
      inDegree.set(c, 0);
      dependents.set(c, new Set());
    }

    for (const c of candidates) {
      for (const depName of c.options?.dependsOn ?? []) {
        const dep = byName.get(depName);
        if (!dep) {
          // Dependencies pointing outside the current chain are ignored
          // silently — this matches the design's "soft dep" semantics.
          continue;
        }
        inDegree.set(c, (inDegree.get(c) ?? 0) + 1);
        dependents.get(dep)!.add(c);
      }
    }

    // Ready queue — sort by (-priority, declarationIndex).
    const ready: Candidate[] = candidates.filter((c) => (inDegree.get(c) ?? 0) === 0);
    ready.sort(compareCandidates);

    const result: Candidate[] = [];
    while (ready.length > 0) {
      const next = ready.shift()!;
      result.push(next);
      for (const dep of dependents.get(next) ?? []) {
        const remaining = (inDegree.get(dep) ?? 0) - 1;
        inDegree.set(dep, remaining);
        if (remaining === 0) {
          insertSorted(ready, dep);
        }
      }
    }

    if (result.length !== candidates.length) {
      const cyclic = candidates
        .filter((c) => !result.includes(c))
        .map((c) => c.resolvedName || '<anonymous>');
      throw new MiddlewareResolutionError(
        `Cycle detected in middleware chain involving: ${cyclic.join(', ')}.`,
        'MIDDLEWARE_CYCLE_DETECTED',
        { participants: cyclic }
      );
    }

    return result;
  }

  private emit(event: string, payload: unknown): void {
    if (!this.events) return;
    try {
      this.events.emit(event, payload);
    } catch {
      /* fail-soft */
    }
    // Suppress "unused private field" if the logger is never invoked directly.
    void this.loggerManager;
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════════════════════

function compareCandidates(a: Candidate, b: Candidate): number {
  const pa = a.options?.priority ?? DEFAULT_PRIORITY;
  const pb = b.options?.priority ?? DEFAULT_PRIORITY;
  if (pb !== pa) return pb - pa; // higher priority first
  return a.declarationIndex - b.declarationIndex;
}

function insertSorted(list: Candidate[], candidate: Candidate): void {
  // Binary-search insertion keeps `ready` in sorted order at O(log n) per insert.
  let low = 0;
  let high = list.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (compareCandidates(list[mid]!, candidate) <= 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  list.splice(low, 0, candidate);
}
