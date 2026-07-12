# @stackra/contracts

Shared vocabulary for every `@stackra/*` package. **Zero runtime implementation** — only symbols, types, interfaces, and enums.

## Install

```bash
pnpm add @stackra/contracts
```

## Layout

The package is organized by symbol kind, not by domain:

```
contracts/src/
├── tokens/       ← `Symbol.for(...)` DI tokens
├── interfaces/   ← every `interface` declaration
├── types/        ← every standalone `type` alias
├── enums/        ← every `enum` and its priority maps
└── events/       ← event constant maps + event-name unions
```

## Public API

### Tokens

```ts
import {
  APPLICATION,
  APP_CONFIG,
  DISCOVERY_SERVICE,
  EVENT_EMITTER,
  EVENT_EMITTER_CONFIG,
  LOGGER_MANAGER,
  LOGGER_CONFIG,
} from '@stackra/contracts';
```

### DI foundation

Everything the DI container needs to describe modules and providers. Deliberately shaped like NestJS's interfaces so the container stays 1:1 compatible with third-party Nest code, without depending on `@stackra/contracts` for types.

```ts
import type {
  Type,
  Abstract,
  InjectionToken,
  ForwardReference,
  OptionalFactoryDependency,
  DynamicModule,
  ModuleMetadata,
  Provider,
  ClassProvider,
  ValueProvider,
  FactoryProvider,
  ExistingProvider,
  IAsyncModuleOptions,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  BeforeApplicationShutdown,
  ScopeOptions,
} from '@stackra/contracts';

import { Scope, ShutdownSignal } from '@stackra/contracts';
```

### Domain contracts

```ts
import type {
  IApplication,
  IDiscoveryService,
  IDiscoveryProvider,
  IEventEmitter,
  ILogger,
  ILoggerManager,
  ILogEntry,
  ILogReporter,
  ILogEnricher,
  ILogFormatter,
  ILogChannelConfig,
  ILoggerModuleConfig,
} from '@stackra/contracts';
```

### Logger types + enum

```ts
import { LogLevel, LOG_LEVEL_PRIORITY, LOGGER_EVENTS } from '@stackra/contracts';
import type { LogContext } from '@stackra/contracts';
```

## License

MIT © Stackra L.L.C
