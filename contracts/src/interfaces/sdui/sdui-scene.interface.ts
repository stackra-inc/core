/**
 * @file sdui-scene.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Contract for a SDUI scene builder. A scene maps a slot
 *   to a high-level view type — list, form, show, kanban, calendar,
 *   chat, command, etc. Scenes are auto-discovered via `@SduiScene()`
 *   and registered with `SceneRegistry`.
 *
 *   The scene **builder** runs on the backend and emits a JSON config
 *   that describes what the rendered scene should look like. The
 *   matching scene **renderer** runs on the client and turns the
 *   config into HeroUI markup verbatim — no schema translation layer.
 */

import type { SduiMode } from '../../enums/sdui/sdui-mode.enum';
import type { ISduiSceneSlotContent } from './sdui-slot-content.interface';
import type { ISduiZoneDescriptor } from './sdui-zone-descriptor.interface';

/**
 * Runtime context handed to a scene builder when assembling a
 * document. The platform supplies this — scene authors only read.
 */
export interface ISduiSceneBuildContext {
  /** Logical resource name producing the scene (`undefined` for pages). */
  readonly resourceName?: string;
  /** Scene identifier the assembler is building. */
  readonly sceneType: string;
  /** Path params from the request (`:id`, `:slug`, …). */
  readonly params: Readonly<Record<string, unknown>>;
  /** Query params from the request. */
  readonly query: Readonly<Record<string, unknown>>;
  /** Scope context (owner, role, user, locale). Loose-typed to avoid coupling. */
  readonly scope: Readonly<Record<string, unknown>>;
  /** Active locale code (BCP-47). */
  readonly locale: string;
  /** Request user (loose-typed). */
  readonly user?: Readonly<Record<string, unknown>>;
  /** Module configuration snapshot (for auth mount path, etc.). */
  readonly config?: Readonly<Record<string, unknown>>;
}

/**
 * The shape a scene builder returns. Identical to
 * `ISduiSceneSlotContent` so the assembler can hand the result
 * straight to a slot without wrapping.
 */
export type ISduiSceneContent = ISduiSceneSlotContent;

/**
 * Scene builder contract. Implementations register via the
 * `@SduiScene()` decorator and are discovered at boot through
 * `IDiscoveryService`.
 *
 * @typeParam TConfig - The shape of the emitted `config` object.
 *   Defaults to `unknown` so the registry can hold heterogeneous
 *   scenes without explicit casting.
 */
export interface ISduiSceneBuilder<TConfig = unknown> {
  /**
   * Scene identifier (`'list'`, `'form'`, `'show'`, `'kanban'`, …).
   * Must be unique across the registry.
   */
  readonly type: string;

  /**
   * Zod schema for the scene's config. Implementations return a
   * `ZodType` so the assembler can validate config at build time.
   * Loose-typed as `unknown` here to keep `@stackra/contracts` free
   * of a Zod dependency.
   */
  configSchema(): unknown;

  /** Default mode hint (`'page'` for most scenes, `'drawer'` for action sheets). */
  defaultMode(): SduiMode;

  /** Platforms the scene targets (`'web'`, `'native'`, or both). */
  platforms(): ReadonlyArray<'web' | 'native'>;

  /**
   * Optional list of zones this scene contributes. Hosts inside the
   * scene's renderer (e.g. `customer.details.side.after`) declare
   * themselves here so `@SduiWidget()` and `@SduiRenderHook()`
   * authors can target them.
   */
  zones?(): readonly ISduiZoneDescriptor[];

  /**
   * Build the scene config for one request. May be sync or async.
   *
   * @param ctx - Request-scoped context (params, query, scope).
   * @returns The assembled `SduiSceneContent` ready to drop into a slot.
   */
  build(ctx: ISduiSceneBuildContext): ISduiSceneContent | Promise<ISduiSceneContent>;

  /**
   * Optional declared output type used by the registry's TypeScript
   * tooling. Phantom — never read at runtime.
   */
  readonly __configType?: TConfig;
}
