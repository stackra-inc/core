import { defineBaseConfig } from '../tsup.config.base';

export default defineBaseConfig(
  { index: 'src/index.ts' },
  {
    // ESM-only because src/env/env.repository.ts uses `import.meta.env`
    // which esbuild refuses to bundle for CJS output.
    format: ['esm'],
  },
);
