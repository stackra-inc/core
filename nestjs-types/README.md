# @stackra/nestjs-types

Zero-runtime re-host of NestJS 11 interfaces, types, enums, and metadata constants.

## Why

Depending on `@nestjs/common` in the browser or in a shared types package drags the whole DI runtime along. This package extracts the type surface only, so you can:

- Type-check code that uses NestJS shapes without shipping NestJS to the browser
- Share cross-package contracts without a `@nestjs/*` runtime dependency
- Keep NestJS-flavoured shapes and metadata keys in one place

## Install

```bash
pnpm add @stackra/nestjs-types
```

## What's inside

- **Interfaces**: `Type`, `Provider` (ClassProvider, ValueProvider, FactoryProvider, ExistingProvider), `DynamicModule`, `ModuleMetadata`, `ScopeOptions`, `ForwardReference`, lifecycle hooks (`OnModuleInit`, `OnModuleDestroy`, `OnApplicationBootstrap`, `OnApplicationShutdown`, `BeforeApplicationShutdown`), features (guards, interceptors, pipes, arguments-host), HTTP, middleware, and websocket adapters.
- **Enums**: `HttpStatus`, `RequestMethod`, `RouteParamtypes`, `Scope`, `ShutdownSignal`, `VersioningType`, microservices `Transport`.
- **Metadata constants**: `MODULE_METADATA`, `PARAMTYPES_METADATA`, `INJECTABLE_WATERMARK`, and the rest of the keys NestJS uses at runtime.

All exported flat from `@stackra/nestjs-types`.

## License

MIT © Stackra L.L.C
