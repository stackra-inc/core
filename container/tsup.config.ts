import { defineBaseConfig } from '../tsup.config.base';

export default defineBaseConfig(
  {
    index: 'src/core/index.ts',
    react: 'src/react/index.ts',
    nestjs: 'src/nestjs/index.ts',
  },
  {
    // Optional runtime deps loaded via lazy `require()` / `await import()`
    // inside try/catch blocks. tsup won't try to resolve/bundle these.
    external: [
      // Optional Express layer (used only when the consumer registers it)
      'express',
      // Optional NestJS middleware — declared in ambient d.ts
      'helmet',
      'compression',
      'cookie-parser',
      // Optional NestJS microservices transport
      '@nestjs/microservices',
      // Sibling stackra packages that are lazy-loaded
      '@stackra/logger/nestjs',
      '@stackra/console',
    ],
  }
);
