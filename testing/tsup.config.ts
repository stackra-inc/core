import { defineBaseConfig } from '../tsup.config.base';

export default defineBaseConfig({
  preset: 'src/preset/index.ts',
  setup: 'src/preset/setup.ts',
});
