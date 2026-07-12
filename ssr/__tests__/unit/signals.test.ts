import { describe, it, expect } from 'vitest';

import {
  RedirectSignal,
  NotFoundSignal,
  AbortSignal as MiddlewareAbortSignal,
  redirect,
  notFound,
  abort,
} from '@/middleware';

describe('redirect()', () => {
  it('throws RedirectSignal with default 302 status', () => {
    expect(() => redirect('/login')).toThrow(RedirectSignal);
    try {
      redirect('/login');
    } catch (e) {
      expect((e as RedirectSignal).status).toBe(302);
      expect((e as RedirectSignal).url).toBe('/login');
      expect((e as RedirectSignal).kind).toBe('redirect');
    }
  });

  it('accepts a custom status in 300..308', () => {
    expect(() => redirect('/x', 301)).toThrow(RedirectSignal);
    expect(() => redirect('/x', 308)).toThrow(RedirectSignal);
  });

  it('rejects a status < 300', () => {
    expect(() => new RedirectSignal('/x', 299)).toThrow(TypeError);
  });

  it('rejects a status > 308', () => {
    expect(() => new RedirectSignal('/x', 309)).toThrow(TypeError);
  });
});

describe('notFound()', () => {
  it('throws NotFoundSignal with the default reason', () => {
    expect(() => notFound()).toThrow(NotFoundSignal);
    try {
      notFound();
    } catch (e) {
      expect((e as NotFoundSignal).reason).toBe('Not Found');
      expect((e as NotFoundSignal).kind).toBe('not-found');
    }
  });

  it('accepts a custom reason', () => {
    try {
      notFound('User 42 does not exist');
    } catch (e) {
      expect((e as NotFoundSignal).reason).toBe('User 42 does not exist');
    }
  });
});

describe('abort()', () => {
  it('throws AbortSignal carrying the result', () => {
    const payload = { status: 503 };
    expect(() => abort(payload)).toThrow(MiddlewareAbortSignal);
    try {
      abort(payload);
    } catch (e) {
      expect((e as MiddlewareAbortSignal).result).toBe(payload);
      expect((e as MiddlewareAbortSignal).kind).toBe('abort');
    }
  });
});
