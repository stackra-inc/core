/**
 * @file json-ld.util.ts
 * @module @stackra/ssr/core/seo/utils
 * @description Schema.org JSON-LD builder helpers.
 *
 *   Each helper returns a well-formed `JsonLd` node with the
 *   `@context` / `@type` set. Cover the documents that matter for SEO
 *   and AEO (Answer Engine Optimization):
 *
 *     - `organization` / `website`  — site identity + sitelinks search box.
 *     - `webPage` / `breadcrumbList` — page + navigation context.
 *     - `article` / `product`        — rich results.
 *     - `faqPage` / `qaPage`         — AEO: answer-engine Q&A extraction.
 *     - `speakable`                  — AEO: voice-assistant read-aloud hints.
 *
 *   These are thin, typed factories — not an exhaustive Schema.org
 *   model. Consumers can always hand-write a raw `JsonLd` object for
 *   anything not covered.
 */

import type { JsonLd } from '../interfaces/json-ld.interface';

const CONTEXT = 'https://schema.org';

/** Organization / brand identity. */
export function organization(input: {
  name: string;
  url: string;
  logo?: string;
  sameAs?: readonly string[];
  contactPoint?: { telephone: string; contactType: string };
}): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'Organization',
    name: input.name,
    url: input.url,
    ...(input.logo ? { logo: input.logo } : {}),
    ...(input.sameAs ? { sameAs: input.sameAs } : {}),
    ...(input.contactPoint
      ? { contactPoint: { '@type': 'ContactPoint', ...input.contactPoint } }
      : {}),
  };
}

/** WebSite node, optionally with a sitelinks search box. */
export function website(input: { name: string; url: string; searchUrlTemplate?: string }): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    name: input.name,
    url: input.url,
    ...(input.searchUrlTemplate
      ? {
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: input.searchUrlTemplate,
            },
            'query-input': 'required name=search_term_string',
          },
        }
      : {}),
  };
}

/** Generic WebPage node. */
export function webPage(input: {
  name: string;
  url: string;
  description?: string;
  primaryImageOfPage?: string;
}): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'WebPage',
    name: input.name,
    url: input.url,
    ...(input.description ? { description: input.description } : {}),
    ...(input.primaryImageOfPage
      ? { primaryImageOfPage: { '@type': 'ImageObject', url: input.primaryImageOfPage } }
      : {}),
  };
}

/** Breadcrumb trail for navigation context + rich results. */
export function breadcrumbList(items: readonly { name: string; url: string }[]): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Article / blog-post rich result. */
export function article(input: {
  headline: string;
  description?: string;
  image?: string | readonly string[];
  datePublished: string;
  dateModified?: string;
  authorName: string;
  publisherName?: string;
  publisherLogo?: string;
}): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'Article',
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
    datePublished: input.datePublished,
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author: { '@type': 'Person', name: input.authorName },
    ...(input.publisherName
      ? {
          publisher: {
            '@type': 'Organization',
            name: input.publisherName,
            ...(input.publisherLogo
              ? { logo: { '@type': 'ImageObject', url: input.publisherLogo } }
              : {}),
          },
        }
      : {}),
  };
}

/** Product rich result with optional offer + rating. */
export function product(input: {
  name: string;
  description?: string;
  image?: string | readonly string[];
  sku?: string;
  brand?: string;
  offer?: { price: number | string; currency: string; availability?: string; url?: string };
  aggregateRating?: { ratingValue: number | string; reviewCount: number };
}): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'Product',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.sku ? { sku: input.sku } : {}),
    ...(input.brand ? { brand: { '@type': 'Brand', name: input.brand } } : {}),
    ...(input.offer
      ? {
          offers: {
            '@type': 'Offer',
            price: input.offer.price,
            priceCurrency: input.offer.currency,
            ...(input.offer.availability
              ? { availability: `https://schema.org/${input.offer.availability}` }
              : {}),
            ...(input.offer.url ? { url: input.offer.url } : {}),
          },
        }
      : {}),
    ...(input.aggregateRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: input.aggregateRating.ratingValue,
            reviewCount: input.aggregateRating.reviewCount,
          },
        }
      : {}),
  };
}

/**
 * FAQ page — AEO. Answer engines extract these Q&A pairs directly into
 * featured snippets and voice answers.
 */
export function faqPage(items: readonly { question: string; answer: string }[]): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/**
 * Q&A page — AEO variant for a single question with community answers.
 */
export function qaPage(input: {
  question: string;
  acceptedAnswer: string;
  suggestedAnswers?: readonly string[];
}): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: input.question,
      acceptedAnswer: { '@type': 'Answer', text: input.acceptedAnswer },
      ...(input.suggestedAnswers
        ? {
            suggestedAnswer: input.suggestedAnswers.map((text) => ({
              '@type': 'Answer',
              text,
            })),
          }
        : {}),
    },
  };
}

/**
 * Speakable specification — AEO. Marks CSS selectors whose content is
 * suitable for text-to-speech (voice assistants).
 */
export function speakable(cssSelectors: readonly string[]): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'SpeakableSpecification',
    cssSelector: cssSelectors,
  };
}
