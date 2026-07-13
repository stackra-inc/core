/**
 * @file is-class.util.ts
 * @module @stackra/ssr/middleware/utils
 * @description Runtime detection of a class constructor.
 */

/**
 * Detect whether a value is a class constructor.
 *
 * Uses the source-string heuristic (`class ...`) — safe for normal class
 * syntax, functional but not perfect for heavily-minified output.
 * Middleware code compiled with tsup / esbuild preserves the leading
 * `class` keyword.
 */
export function isClass(value: unknown): value is new (...args: unknown[]) => object {
  if (typeof value !== 'function') return false;
  const source = Function.prototype.toString.call(value);
  return /^class[\s{]/.test(source);
}
