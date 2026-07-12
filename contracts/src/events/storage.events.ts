/**
 * @file storage.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by `@stackra/storage`.
 *
 *   Emitted by `StorageService` on the optional `EVENT_EMITTER` bus
 *   whenever a file is uploaded, downloaded, or deleted.
 *
 *   @example
 *   ```typescript
 *   import { STORAGE_EVENTS } from '@stackra/contracts';
 *
 *   @OnEvent(STORAGE_EVENTS.UPLOADED)
 *   onUpload(payload: { path: string; size: number; disk: string }) {
 *     metrics.observe('storage.bytes', payload.size);
 *   }
 *   ```
 */

/**
 * Storage lifecycle event names.
 *
 * Payload shapes:
 * - `UPLOADED`   — `{ path, size, disk, url }`
 * - `DOWNLOADED` — `{ path, size, disk }`
 * - `DELETED`    — `{ path, disk }`
 */
export const STORAGE_EVENTS = {
  /** A file was uploaded successfully. */
  UPLOADED: 'storage.uploaded',
  /** A file was downloaded successfully. */
  DOWNLOADED: 'storage.downloaded',
  /** A file was deleted from a disk. */
  DELETED: 'storage.deleted',
} as const;

/** Union type of every emitted storage event name. */
export type StorageEventName = (typeof STORAGE_EVENTS)[keyof typeof STORAGE_EVENTS];
