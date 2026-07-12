/**
 * @file registers-globals.decorator.ts
 * @description Class decorator that auto-calls `bootGlobals()` on module init.
 *
 * Apply to any NestJS service that implements `bootGlobals()`.
 * The decorator hooks into `onModuleInit` automatically — no need to
 * implement the interface or write the lifecycle method yourself.
 *
 * @example
 * ```ts
 * @Injectable()
 * @RegistersGlobals()
 * export class TranslationService {
 *   bootGlobals(): void {
 *     GlobalRegistry.register('i18n', {
 *       t: (key, args) => this.t(key, args),
 *       __: (key, args) => this.t(key, args),
 *     }, { namespace: 'i18n' });
 *   }
 * }
 * ```
 */

/**
 * Class decorator that calls `bootGlobals()` during NestJS module initialization.
 * The decorated class must have a `bootGlobals(): void` method.
 */
export function RegistersGlobals(): ClassDecorator {
  return (target: Function) => {
    const originalOnModuleInit = target.prototype.onModuleInit;

    target.prototype.onModuleInit = function (...args: any[]) {
      // Call bootGlobals
      if (typeof this.bootGlobals === "function") {
        this.bootGlobals();
      }

      // Call original onModuleInit if it existed
      if (typeof originalOnModuleInit === "function") {
        return originalOnModuleInit.apply(this, args);
      }
    };
  };
}
