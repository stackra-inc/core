/**
 * NestApplicationContextOptions
 *
 * Copied from @nestjs/common source (packages/common/interfaces).
 *
 * @see https://github.com/nestjs/nest
 * @publicApi
 */

/**
 * Log level type from NestJS.
 */
export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

/**
 * Minimal LoggerService interface from NestJS.
 */
export interface LoggerService {
  log(message: any, ...optionalParams: any[]): any;
  error(message: any, ...optionalParams: any[]): any;
  warn(message: any, ...optionalParams: any[]): any;
  debug?(message: any, ...optionalParams: any[]): any;
  verbose?(message: any, ...optionalParams: any[]): any;
  fatal?(message: any, ...optionalParams: any[]): any;
  setLogLevels?(levels: LogLevel[]): any;
}

/**
 * @publicApi
 */
export class NestApplicationContextOptions {
  /**
   * Specifies the logger to use. Pass `false` to turn off logging.
   */
  logger?: LoggerService | LogLevel[] | false;

  /**
   * Whether to abort the process on Error. By default, the process is exited.
   * Pass `false` to override the default behavior. If `false` is passed, Nest will not exit
   * the application and instead will rethrow the exception.
   * @default true
   */
  abortOnError?: boolean | undefined;

  /**
   * If enabled, logs will be buffered until the "Logger#flush" method is called.
   * @default false
   */
  bufferLogs?: boolean;

  /**
   * If enabled, logs will be automatically flushed and buffer detached when
   * application initialization process either completes or fails.
   * @default true
   */
  autoFlushLogs?: boolean;

  /**
   * Whether to run application in the preview mode.
   * In the preview mode, providers/controllers are not instantiated & resolved.
   *
   * @default false
   */
  preview?: boolean;

  /**
   * Whether to generate a serialized graph snapshot.
   *
   * @default false
   */
  snapshot?: boolean;

  /**
   * Determines what algorithm use to generate module ids.
   * When set to `deep-hash`, the module id is generated based on the serialized module definition.
   * When set to `reference`, each module obtains a unique id based on its reference.
   *
   * @default 'reference'
   */
  moduleIdGeneratorAlgorithm?: 'deep-hash' | 'reference';

  /**
   * Instrument the application context.
   */
  instrument?: {
    /**
     * Function that decorates each instance created by the application context.
     */
    instanceDecorator: (instance: unknown) => unknown;
  };

  /**
   * If enabled, will force the use of console.log/console.error instead of process.stdout/stderr.write.
   * @default false
   */
  forceConsole?: boolean;
}
