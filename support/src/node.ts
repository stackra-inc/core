/**
 * @file node.ts
 * @module @stackra/support/node
 * @description Node.js-only utilities (file system, path helpers).
 *   Import from '@stackra/support/node' — never from the main entry.
 *   These use Node.js APIs (fs, path) and will crash in browser/native.
 */

export { File } from './file';
