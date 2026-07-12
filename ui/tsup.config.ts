import { defineBaseConfig } from '../tsup.config.base';

export default defineBaseConfig({
  index: 'src/index.ts',
  react: 'src/react/index.ts',
  // Iconify wrapper + bundled Gravity UI collection
  'icons/iconify': 'src/icons/iconify.tsx',
  'icons/gravity-ui': 'src/icons/gravity-ui/index.js',
  // Heroicons — one entry per glyph size / weight so consumers tree-shake
  'icons/heroicon/outline': 'src/icons/heroicon/outline.ts',
  'icons/heroicon/solid': 'src/icons/heroicon/solid.ts',
  'icons/heroicon/mini': 'src/icons/heroicon/mini.ts',
  'icons/heroicon/micro': 'src/icons/heroicon/micro.ts',
});
