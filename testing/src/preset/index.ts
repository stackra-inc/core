/**
 * @file index.ts
 * @module @stackra/testing/preset
 * @description Shared Vitest configuration preset for the monorepo.
 *   Consumed as JIT source — not compiled.
 *
 *   The preset uses `unplugin-swc` for TypeScript transforms because
 *   the default Vitest esbuild pipeline does not emit
 *   `design:paramtypes` metadata reliably in every environment. Every
 *   package here depends on decorator metadata for DI resolution, so
 *   SWC with `emitDecoratorMetadata: true` is mandatory.
 */

import { defineConfig } from 'vitest/config';
import path from 'node:path';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    swc.vite({
      module: { type: 'es6' },
      jsc: {
        target: 'es2022',
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
        keepClassNames: true,
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    include: ['__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/index.ts', 'src/**/*.interface.ts', 'src/**/*.type.ts', 'src/**/*.d.ts'],
    },
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
});
