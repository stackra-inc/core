/**
 * @file storage-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/storage
 * @description Typed payloads for every constant in `STORAGE_EVENTS`.
 */

/**
 * Common fields carried by every storage lifecycle payload.
 */
export interface IStorageEventBase {
  /** Path (relative to the disk root). */
  readonly path: string;
  /** Disk name that produced the event. */
  readonly disk: string;
}

/**
 * Payload for `STORAGE_EVENTS.UPLOADED` — a file was uploaded to a
 * disk.
 */
export interface IStorageUploadedPayload extends IStorageEventBase {
  /** Size in bytes. */
  readonly size: number;
  /** Public / signed URL when available. */
  readonly url?: string;
}

/**
 * Payload for `STORAGE_EVENTS.DOWNLOADED` — a file was successfully
 * downloaded from a disk.
 */
export interface IStorageDownloadedPayload extends IStorageEventBase {
  /** Size in bytes. */
  readonly size: number;
}

/**
 * Payload for `STORAGE_EVENTS.DELETED` — a file was deleted from a
 * disk.
 */
export interface IStorageDeletedPayload extends IStorageEventBase {}
