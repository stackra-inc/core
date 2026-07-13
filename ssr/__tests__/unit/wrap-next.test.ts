import { describe, it, expect } from 'vitest';

import { wrapNext, MiddlewareExecutionError } from '@/core/middleware';

describe('wrapNext', () => {
  it('forwards to the pipeline next callback', async () => {
    const next = wrapNext(async (v: number) => v * 2, 5, 'test-mw');
    const result = await next();
    expect(result).toBe(10);
  });

  it('throws NEXT_CALLED_MULTIPLE_TIMES on second invocation', async () => {
    const next = wrapNext(async (v: number) => v * 2, 5, 'test-mw');
    await next();
    await expect(next()).rejects.toBeInstanceOf(MiddlewareExecutionError);
    try {
      await next();
    } catch (e) {
      expect((e as MiddlewareExecutionError).code).toBe('NEXT_CALLED_MULTIPLE_TIMES');
      expect((e as MiddlewareExecutionError).meta.middlewareName).toBe('test-mw');
    }
  });
});
