import { defineBaseConfig } from '../tsup.config.base';

export default defineBaseConfig({
  index: 'src/core/index.ts',
  middleware: 'src/middleware/index.ts',
  server: 'src/server/index.ts',
  react: 'src/react/index.ts',
  vite: 'src/vite/index.ts',
  testing: 'src/testing/index.ts',
});
