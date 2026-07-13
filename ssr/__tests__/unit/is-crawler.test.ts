import { describe, it, expect } from 'vitest';

import { isCrawler } from '@/core/server';

describe('isCrawler', () => {
  it('matches common search-engine bots', () => {
    expect(
      isCrawler('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')
    ).toBe(true);
    expect(
      isCrawler('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)')
    ).toBe(true);
    expect(isCrawler('DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)')).toBe(true);
    expect(isCrawler('Mozilla/5.0 (compatible; YandexBot/3.0)')).toBe(true);
  });

  it('matches social-preview bots', () => {
    expect(isCrawler('Twitterbot/1.0')).toBe(true);
    expect(isCrawler('facebookexternalhit/1.1')).toBe(true);
    expect(isCrawler('LinkedInBot/1.0')).toBe(true);
    expect(isCrawler('Slackbot-LinkExpanding 1.0')).toBe(true);
    expect(isCrawler('Discordbot/2.0')).toBe(true);
  });

  it('treats real browsers as human', () => {
    expect(
      isCrawler(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
      )
    ).toBe(false);
    expect(
      isCrawler('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15')
    ).toBe(false);
  });

  it('handles null / empty user-agents as human', () => {
    expect(isCrawler(null)).toBe(false);
    expect(isCrawler(undefined)).toBe(false);
    expect(isCrawler('')).toBe(false);
  });
});
