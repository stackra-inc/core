import { describe, it, expect } from 'vitest';
import 'reflect-metadata';

import { defineMiddleware, MIDDLEWARE_METADATA_KEY } from '@/core/middleware';

describe('defineMiddleware', () => {
  it('is a runtime identity for the function form', () => {
    const handler = async () => 'ok';
    expect(defineMiddleware(handler)).toBe(handler);
  });

  it('is a runtime identity for the options form', () => {
    const options = {
      name: 'test',
      priority: 10,
      handle: async () => 'ok',
    };
    expect(defineMiddleware(options)).toBe(options);
  });

  it('preserves every option field', () => {
    const options = {
      name: 'ttl',
      description: 'ttl guard',
      priority: 42,
      runOn: 'server' as const,
      stage: 'http' as const,
      dependsOn: ['auth'] as readonly string[],
      handle: async () => 'ok',
      meta: { audit: true },
    };
    const result = defineMiddleware(options);
    expect(result.name).toBe('ttl');
    expect(result.description).toBe('ttl guard');
    expect(result.priority).toBe(42);
    expect(result.runOn).toBe('server');
    expect(result.stage).toBe('http');
    expect(result.dependsOn).toEqual(['auth']);
    expect(result.meta).toEqual({ audit: true });
  });

  it('attaches metadata to class-form middleware', () => {
    class MyMiddleware {
      async handle() {
        return 'handled';
      }
    }
    defineMiddleware(MyMiddleware, { name: 'my-mw', priority: 5 });
    const meta = Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, MyMiddleware);
    expect(meta).toEqual({ name: 'my-mw', priority: 5 });
  });

  it('returns the class constructor unchanged', () => {
    class MyMiddleware {
      async handle() {
        return 'ok';
      }
    }
    const result = defineMiddleware(MyMiddleware);
    expect(result).toBe(MyMiddleware);
  });
});
