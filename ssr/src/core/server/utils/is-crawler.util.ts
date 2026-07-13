/**
 * @file is-crawler.util.ts
 * @module @stackra/ssr/core/server/utils
 * @description Detects crawler/bot User-Agent strings.
 *
 *   The SSR runtime uses this to decide between the fully-rendered
 *   crawler path and the client-only shell path — the "SSR for SEO only"
 *   architecture decision from the workspace charter.
 *
 *   The pattern covers major search-engine crawlers, social-preview bots,
 *   and archival crawlers. Consumers can extend detection by passing an
 *   `isCrawler` override to `renderRequest(...)`.
 */

/**
 * Case-insensitive regex matching known crawler / bot User-Agents.
 *
 * Exported so consumers can extend the list by composing another regex
 * or wrap `isCrawler` with a custom predicate.
 */
export const CRAWLER_PATTERN =
  /(googlebot|bingbot|yahoo|duckduckbot|baiduspider|yandex|twitterbot|facebookexternalhit|linkedinbot|whatsapp|slackbot|discordbot|applebot|telegrambot|petalbot|bytespider|semrushbot|ahrefsbot|mj12bot|dotbot|rogerbot|screaming\s?frog|embedly|quora\s?link|showyoubot|outbrain|pinterest|developers\.google\.com\/\+\/web\/snippet)/i;

/**
 * Returns `true` when the supplied User-Agent looks like a crawler.
 *
 * `null`, `undefined`, or empty strings return `false` — anonymous
 * requests are treated as human traffic and get the SPA shell.
 *
 * @param userAgent - The `User-Agent` header value (nullable — safe to
 *   pass `request.headers.get('user-agent')` directly).
 */
export function isCrawler(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return CRAWLER_PATTERN.test(userAgent);
}
