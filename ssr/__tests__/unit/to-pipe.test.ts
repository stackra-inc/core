import { describe, it, expect } from 'vitest';
import 'reflect-metadata';

import { defineMiddleware, toPipe, MiddlewareExecutionError } from '@/middleware';
import { createMockContainer } from '@/testing';

describe('toPipe', () => {
  const container = createMockContainer();

  it('adapts a function-form middleware', async () => {
    const mw = defineMiddleware(async (ctx: { n: number }, next) => {
      ctx.n += 1;
      return next();
    });
    const pipe = toPipe(mw, container, 'increment');
    const ctx = { n: 0 };
    await (pipe as (p: unknown, n: (p: unknown) => unknown) => Promise<unknown>)(
      ctx,
      async () => ctx
    );
    expect(ctx.n).toBe(1);
  });

  it('adapts an options-with-handle form', async () => {
    const mw = defineMiddleware({
      name: 'inc',
      handle: async (ctx: { n: number }, next) => {
        ctx.n += 10;
        return next();
      },
    });
    const pipe = toPipe(mw, container, 'inc');
    const ctx = { n: 0 };
    await (pipe as (p: unknown, n: (p: unknown) => unknown) => Promise<unknown>)(
      ctx,
      async () => ctx
    );
    expect(ctx.n).toBe(10);
  });

  it('wraps class-resolution failures as MIDDLEWARE_RESOLUTION_FAILED', async () => {
    class MissingMw {
      async handle() {
        return 'never';
      }
    }
    const pipe = toPipe(MissingMw, container, 'missing');
    await expect(
      (pipe as (p: unknown, n: (p: unknown) => unknown) => Promise<unknown>)(
        {},
        async () => undefined
      )
    ).rejects.toBeInstanceOf(MiddlewareExecutionError);
  });

  it('adapts a class-form middleware when the class is registered', async () => {
    class RegisteredMw {
      async handle(ctx: { called: boolean }, next: () => Promise<unknown>) {
        ctx.called = true;
        return next();
      }
    }
    const ctx = createMockContainer();
    ctx.provide(RegisteredMw, new RegisteredMw());
    const pipe = toPipe(RegisteredMw, ctx, 'registered');
    const passable = { called: false };
    await (pipe as (p: unknown, n: (p: unknown) => unknown) => Promise<unknown>)(
      passable,
      async () => undefined
    );
    expect(passable.called).toBe(true);
  });
});
