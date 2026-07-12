/**
 * @file events.module.ts
 * @module @stackra/events/core
 * @description DI module for the event system.
 *   Registers EventEmitter, EventTransportRegistry, and EventSubscribersLoader
 *   globally. Works in both ts-container (frontend) and NestJS (backend).
 */

import { Module, type DynamicModule } from '@stackra/container';
import type { IAsyncModuleOptions } from '@stackra/contracts';

import { EVENT_EMITTER, EVENT_EMITTER_CONFIG, EVENT_TRANSPORT_REGISTRY_TOKEN } from './constants';
import { EventEmitter } from './services/event-emitter.service';
import { EventTransportRegistry } from './services/event-transport-registry.service';
import { EventSubscribersLoader } from './services/event-subscribers-loader.service';
import type { IEventEmitterConfig } from './interfaces';
import { mergeConfig } from './utils/merge-config.util';

// Module

/**
 * Event emitter DI module.
 *
 * Registers the EventEmitter as a global singleton with configurable
 * wildcard matching, max listeners, and delimiter. Also registers
 * the auto-discovery loader for `@OnEvent` and `@EventTransport`.
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     EventEmitterModule.forRoot({
 *       wildcard: true,
 *       delimiter: '.',
 *       maxListeners: 20,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
export class EventEmitterModule {
  /**
   * Configure the event emitter module with static options.
   *
   * @param config - Event emitter configuration
   * @returns Dynamic module definition
   */
  public static forRoot(config?: IEventEmitterConfig): DynamicModule {
    const mergedConfig = mergeConfig(config);

    return {
      module: EventEmitterModule,
      global: mergedConfig.global,
      providers: [
        // Config
        { provide: EVENT_EMITTER_CONFIG, useValue: mergedConfig },

        // EventEmitter singleton
        EventEmitter,
        { provide: EVENT_EMITTER, useExisting: EventEmitter },

        // Transport registry
        EventTransportRegistry,
        { provide: EVENT_TRANSPORT_REGISTRY_TOKEN, useExisting: EventTransportRegistry },

        // Auto-discovery loader (runs onModuleInit)
        EventSubscribersLoader,
      ],
      exports: [
        EVENT_EMITTER_CONFIG,
        EventEmitter,
        EVENT_EMITTER,
        EventTransportRegistry,
        EVENT_TRANSPORT_REGISTRY_TOKEN,
      ],
    };
  }

  /**
   * Configure the event emitter module with async factory.
   *
   * @param options - Async options with useFactory and inject
   * @returns Dynamic module definition
   */
  public static forRootAsync(options: IAsyncModuleOptions<IEventEmitterConfig>): DynamicModule {
    return {
      module: EventEmitterModule,
      global: true,
      providers: [
        {
          provide: EVENT_EMITTER_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        EventEmitter,
        { provide: EVENT_EMITTER, useExisting: EventEmitter },
        EventTransportRegistry,
        { provide: EVENT_TRANSPORT_REGISTRY_TOKEN, useExisting: EventTransportRegistry },
        EventSubscribersLoader,
      ],
      exports: [
        EVENT_EMITTER_CONFIG,
        EventEmitter,
        EVENT_EMITTER,
        EventTransportRegistry,
        EVENT_TRANSPORT_REGISTRY_TOKEN,
      ],
    };
  }
}
