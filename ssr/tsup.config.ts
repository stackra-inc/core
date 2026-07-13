import { defineBaseConfig } from '../tsup.config.base';

export default defineBaseConfig({
  index: 'src/core/index.ts',
  middleware: 'src/core/middleware/index.ts',
  server: 'src/core/server/index.ts',
  seo: 'src/core/seo/index.ts',
  react: 'src/react/index.ts',
  vite: 'src/vite/index.ts',
  testing: 'src/testing/index.ts',
});
