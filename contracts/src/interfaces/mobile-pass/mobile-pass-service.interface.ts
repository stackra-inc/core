/**
 * @file mobile-pass-service.interface.ts
 * @module @stackra/contracts/interfaces/mobile-pass
 * @description Public contract for the mobile-pass lifecycle facade,
 *   resolved via the `MOBILE_PASS_SERVICE` token.
 *
 *   The concrete pass record type lives inside `@stackra/mobile-pass`
 *   (a MikroORM `EntitySchema`-backed class), so entity-returning
 *   methods are typed against a structural `IMobilePassRecord` shape
 *   here rather than the concrete class.
 */

/**
 * Polymorphic model association attached to a pass at creation time.
 */
export interface IMobilePassModelRef {
  /** Model type discriminator (e.g. `'User'`, `'Order'`). */
  readonly type: string;
  /** Model identifier. */
  readonly id: string;
}

/**
 * Options accepted by `create()`.
 */
export interface IMobilePassCreateOptions {
  /** Optional polymorphic model association. */
  readonly model?: IMobilePassModelRef;
  /** Custom download filename (without the `.pkpass` extension). */
  readonly downloadName?: string;
}

/**
 * Options accepted by `updateField()`.
 */
export interface IMobilePassFieldUpdateOptions {
  /** Replacement human-readable label for the field. */
  readonly label?: string;
  /** Lock-screen change message shown when the pass updates. */
  readonly changeMessage?: string;
}

/**
 * Minimal structural shape of a persisted pass record. The concrete
 * implementation in `@stackra/mobile-pass` carries additional columns.
 */
export interface IMobilePassRecord {
  /** Pass UUID. */
  readonly id: string;
  /** Unique pass serial number. */
  readonly passSerial: string;
  /** Target platform (`'apple'` | `'google'`). */
  readonly platform: string;
  /** Pass type category. */
  readonly type: string;
}

/**
 * High-level mobile-pass lifecycle facade. Implemented by
 * `MobilePassService` and exposed via `MOBILE_PASS_SERVICE`.
 */
export interface IMobilePassService {
  /** Create and persist a pass from compiled builder output. */
  create(compiled: unknown, options?: IMobilePassCreateOptions): Promise<IMobilePassRecord>;
  /** Find a pass by its unique serial number. */
  findBySerial(serial: string): Promise<IMobilePassRecord | null>;
  /** Find a pass by its UUID. */
  findById(id: string): Promise<IMobilePassRecord | null>;
  /** Expire / void a pass and trigger push updates. */
  expire(passId: string): Promise<void>;
  /** Update a single field value on an Apple pass. */
  updateField(
    passId: string,
    fieldKey: string,
    value: string,
    options?: IMobilePassFieldUpdateOptions
  ): Promise<void>;
  /** Whether the pass is currently saved in at least one wallet. */
  isInWallet(passId: string): Promise<boolean>;
  /** Get the add-to-wallet URL for a pass. */
  getWalletUrl(passId: string): Promise<string>;
}
