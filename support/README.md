# @stackra/support

Shared foundation utilities used across every `@stackra/*` package.

## Install

```bash
pnpm add @stackra/support
```

## API

### `GlobalRegistry`

Central registry for attaching helpers to `globalThis`. Handles conflict detection, namespacing, and cleanup.

```ts
import { GlobalRegistry } from '@stackra/support';

GlobalRegistry.register('i18n', {
  t: (key, args) => translate(key, args),
  __: (key, args) => translate(key, args),
}, { namespace: 'i18n' });

// Now available globally:
declare global {
  function t(key: string, args?: object): string;
  const i18n: { t: typeof t };
}
```

### `@RegistersGlobals()`

Class decorator that auto-calls `bootGlobals()` during NestJS module init. Apply to any service that implements `bootGlobals()`.

```ts
import { Injectable } from '@nestjs/common';
import { RegistersGlobals, GlobalRegistry } from '@stackra/support';

@Injectable()
@RegistersGlobals()
export class TranslationService {
  bootGlobals(): void {
    GlobalRegistry.register('i18n', { t: this.t.bind(this) });
  }
}
```

### Env repository, base registry, and collections

Also ships with utilities the higher-level Stackra packages use internally: `Env` (env-var reader), `BaseRegistry` (typed key/value registry), plus `Collection`, `MapCollection`, `SetCollection` (collect.js-flavoured helpers). All exported from the root.

## License

MIT © Stackra L.L.C
