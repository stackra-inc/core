import { defineBaseConfig } from '../tsup.config.base';

export default defineBaseConfig({
  index: 'src/core/index.ts',
  react: 'src/react/index.ts',
});
