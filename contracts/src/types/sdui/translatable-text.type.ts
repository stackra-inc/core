/**
 * @file translatable-text.type.ts
 * @module @stackra/contracts/types/sdui
 * @description The shape of every user-facing string in a SDUI document.
 *
 *   Three accepted forms — listed in order of preference for new code:
 *
 *   1. **i18n key reference** — `{ key, args?, defaultValue? }`
 *      The renderer resolves the key through `@stackra/i18n.t()` with
 *      the current locale. The optional `args` are interpolated; the
 *      optional `defaultValue` is shown when the key has no entry in
 *      the active locale's bundle. This is the canonical form for any
 *      string the product team owns.
 *
 *   2. **Locale-keyed values** — `{ values: Record<string, string> }`
 *      Inline translations for situations where i18n keys would create
 *      noise (one-off field labels in a generated form, tooltip text in
 *      a dev tool). The renderer picks `values[locale]` or falls back
 *      to `values.en`.
 *
 *   3. **Plain string** — escape hatch for prototypes and dev-time
 *      messaging. The i18n linter flags these in CI so production code
 *      always evolves toward form (1) or (2).
 *
 *   The `TText` component in the SDUI renderer accepts all three forms
 *   uniformly; calling code never needs to discriminate.
 */

/**
 * The canonical i18n-key form. The renderer resolves `key` against
 * the active locale's bundle, interpolating `args` into placeholders.
 */
export interface ITranslatableKey {
  /** Dot-separated key inside the i18n catalog (e.g. `auth.login.title`). */
  readonly key: string;

  /**
   * Optional interpolation map. Values are coerced to strings by the
   * i18n engine before substitution.
   */
  readonly args?: Readonly<Record<string, unknown>>;

  /**
   * Optional fallback string used when the resolved bundle does not
   * contain `key`. Useful for new features whose translations have not
   * landed in every locale yet.
   */
  readonly defaultValue?: string;
}

/**
 * The locale-keyed inline form. Mapping `locale → translated string`.
 * The renderer selects `values[currentLocale]` or `values.en` as a
 * last-resort fallback.
 */
export interface ITranslatableValues {
  /** Map of BCP-47 locale code → translated string. */
  readonly values: Readonly<Record<string, string>>;
}

/**
 * Anything the SDUI renderer can resolve to a human-readable string.
 *
 * The renderer disambiguates at runtime by checking for a `key`
 * property first (i18n-key form), then a `values` property
 * (wrapped-locale form), and finally treats any remaining record
 * shape as a bare locale-record. The bare-record form
 * (`{ en: 'foo', ar: 'بار' }`) is supported for backward
 * compatibility with simple blueprints and tests that pre-date the
 * richer i18n-key + wrapped-values forms.
 *
 * @see ITranslatableKey
 * @see ITranslatableValues
 */
export type TranslatableText =
  string | ITranslatableKey | ITranslatableValues | Readonly<Record<string, string>>;
