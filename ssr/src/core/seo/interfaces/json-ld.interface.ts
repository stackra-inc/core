/**
 * @file json-ld.interface.ts
 * @module @stackra/ssr/core/seo/interfaces
 * @description Schema.org JSON-LD document shapes.
 *
 *   JSON-LD (`<script type="application/ld+json">`) is the primary
 *   structured-data format search engines and answer engines (AEO)
 *   consume. We model it loosely — a `JsonLd` is any object with a
 *   `@type` (and usually `@context`). Builder helpers in
 *   `../utils/json-ld.util.ts` produce well-formed common documents.
 */

/**
 * A single JSON-LD node. `@context` defaults to `https://schema.org`
 * when produced by the builders. Arbitrary Schema.org properties are
 * allowed — the type is intentionally open.
 */
export interface JsonLd {
  readonly '@context'?: string;
  readonly '@type': string;
  readonly [property: string]: unknown;
}
