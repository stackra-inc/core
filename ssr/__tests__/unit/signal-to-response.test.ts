import { describe, it, expect } from 'vitest';

import { signalToResponse, errorToResponse } from '@/core/server';
import { redirect, notFound, abort } from '@/core/middleware';

describe('signalToResponse', () => {
  it('maps a redirect signal to a 3xx Response with Location', () => {
    let res: Response | null = null;
    try {
      redirect('/login', 302);
    } catch (e) {
      res = signalToResponse(e);
    }
    expect(res?.status).toBe(302);
    expect(res?.headers.get('location')).toBe('/login');
  });

  it('maps a notFound signal to a 404 Response', () => {
    let res: Response | null = null;
    try {
      notFound('missing');
    } catch (e) {
      res = signalToResponse(e);
    }
    expect(res?.status).toBe(404);
  });

  it('unwraps an abort signal carrying a Response', () => {
    const original = new Response('teapot', { status: 418 });
    let res: Response | null = null;
    try {
      abort(original);
    } catch (e) {
      res = signalToResponse(e);
    }
    expect(res).toBe(original);
  });

  it('JSON-serialises an abort signal carrying an object', async () => {
    let res: Response | null = null;
    try {
      abort({ ok: false });
    } catch (e) {
      res = signalToResponse(e);
    }
    expect(res?.headers.get('content-type')).toContain('application/json');
    expect(await res?.json()).toEqual({ ok: false });
  });

  it('returns null for non-signal errors', () => {
    expect(signalToResponse(new Error('boom'))).toBeNull();
  });
});

describe('errorToResponse', () => {
  it('returns a generic 500 by default', async () => {
    const res = errorToResponse(new Error('secret detail'));
    expect(res.status).toBe(500);
    expect(await res.text()).toBe('Internal Server Error');
  });

  it('exposes the message when asked', async () => {
    const res = errorToResponse(new Error('visible detail'), true);
    expect(await res.text()).toBe('visible detail');
  });
});
