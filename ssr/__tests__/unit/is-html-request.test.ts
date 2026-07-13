import { describe, it, expect } from 'vitest';
import type { IncomingMessage } from 'node:http';

import { isHtmlRequest } from '@/vite';

function req(url: string, accept?: string, method = 'GET'): IncomingMessage {
  return { url, method, headers: accept ? { accept } : {} } as unknown as IncomingMessage;
}

describe('isHtmlRequest', () => {
  it('accepts document navigations', () => {
    expect(isHtmlRequest(req('/', 'text/html'))).toBe(true);
    expect(isHtmlRequest(req('/dashboard', 'text/html,application/xhtml+xml'))).toBe(true);
  });

  it('rejects static assets by extension', () => {
    expect(isHtmlRequest(req('/assets/app.js', 'text/html'))).toBe(false);
    expect(isHtmlRequest(req('/styles.css'))).toBe(false);
    expect(isHtmlRequest(req('/logo.svg'))).toBe(false);
  });

  it('rejects Vite internal endpoints', () => {
    expect(isHtmlRequest(req('/@vite/client'))).toBe(false);
    expect(isHtmlRequest(req('/@react-refresh'))).toBe(false);
    expect(isHtmlRequest(req('/node_modules/.vite/deps/react.js'))).toBe(false);
  });

  it('rejects RRD .data requests', () => {
    expect(isHtmlRequest(req('/dashboard.data', 'text/html'))).toBe(false);
  });

  it('treats extension-less GET without Accept as HTML', () => {
    expect(isHtmlRequest(req('/some/page'))).toBe(true);
  });
});
