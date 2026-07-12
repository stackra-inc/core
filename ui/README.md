# @stackra/ui

Client-side UI kit for the Stackra framework. Re-exports HeroUI OSS + HeroUI Pro components under a single package, adds custom composite components, hooks, providers, contexts, and heroicons subpaths.

## Install

```bash
pnpm add @stackra/ui @heroui/react @heroui-pro/react @heroicons/react react react-dom tailwindcss
```

**Important — pnpm approvals for HeroUI Pro:** HeroUI Pro ships a postinstall script that downloads licensed component artifacts from its CDN. pnpm 10 blocks postinstall scripts by default; approve it explicitly in your workspace:

```yaml
# pnpm-workspace.yaml
onlyBuiltDependencies:
  - '@heroui-pro/react'
  - 'heroui-pro'
```

Or in your `package.json`:

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["@heroui-pro/react", "heroui-pro"]
  }
}
```

For bun users, add to `package.json`:

```json
{
  "trustedDependencies": ["heroui-pro"]
}
```

Then run `npx heroui-pro login && npx heroui-pro install` to authenticate and fetch Pro components.

## Usage

```tsx
// Web components (HeroUI + HeroUI Pro + custom composites)
import { Button, Card, ConfirmDialog, PhoneInput } from '@stackra/ui/react';

// Platform-agnostic hooks
import { useDebounce } from '@stackra/ui';

// Icons — subpath per glyph size / weight
import { ArrowLeftIcon } from '@stackra/ui/icons/outline';
import { CheckIcon } from '@stackra/ui/icons/solid';
import { XMarkIcon } from '@stackra/ui/icons/mini';
import { CogIcon } from '@stackra/ui/icons/micro';

// Global styles
import '@stackra/ui/react/styles';
```

## Subpaths

| Import path                 | Contents                                                          |
| --------------------------- | ----------------------------------------------------------------- |
| `@stackra/ui`               | Platform-agnostic hooks (`useDebounce`)                           |
| `@stackra/ui/react`         | HeroUI OSS + Pro components, custom composites, hooks, providers  |
| `@stackra/ui/icons`         | `IconType` type                                                   |
| `@stackra/ui/icons/outline` | 24px outline heroicons                                            |
| `@stackra/ui/icons/solid`   | 24px solid heroicons                                              |
| `@stackra/ui/icons/mini`    | 20px heroicons                                                    |
| `@stackra/ui/icons/micro`   | 16px heroicons                                                    |
| `@stackra/ui/react/styles`  | Global CSS (imports HeroUI Pro styles + custom controllers + RTL) |

## License

MIT
