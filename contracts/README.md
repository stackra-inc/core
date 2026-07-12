# @stackra/contracts

Shared interfaces, types, enums, and DI tokens for the Stackra ecosystem. **Zero runtime implementation** — this package ships only type definitions and `Symbol.for(...)` tokens.

## Install

```bash
pnpm add @stackra/contracts
```

## What's inside

### DI tokens

Three cross-package `Symbol.for(...)` tokens for wiring the DI container:

```ts
import { APPLICATION, APP_CONFIG, DISCOVERY_SERVICE } from '@stackra/contracts';
```

### Interfaces

```ts
import type {
  IApplication, // Bootstrapped app context contract
  IApplicationOptions, // Full IApplicationOptions for Application.create()
  IContainer, // Minimal container inspection contract
  IDiscoveryService, // Cross-package discovery contract
  IDiscoveryProvider, // A discovered provider entry
} from '@stackra/contracts';
```

### Re-exports from `@stackra/nestjs-types`

Everything NestJS-shaped that consumers might need — imported from one place so they don't need to depend on `@nestjs/common` for types:

```ts
import type {
  Type,
  InjectionToken,
  Provider,
  DynamicModule,
  ModuleMetadata,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  BeforeApplicationShutdown,
  ForwardReference,
  OptionalFactoryDependency,
} from '@stackra/contracts';

import { Scope, ShutdownSignal } from '@stackra/contracts';
```

## License

MIT © Stackra L.L.C
