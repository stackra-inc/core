/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/link
 * @description Barrel for public link-related contracts.
 *
 *   Currently only exposes the event payload shapes emitted by
 *   `LinkModuleService`. The runtime pivot service, metadata types,
 *   and filter interfaces stay inside `@stackra/link` because they
 *   are only consumed within the link package.
 */
export type {
  ILinkEventPayloadBase,
  ILinkAttachedPayload,
  ILinkDetachedPayload,
  ILinkSyncedPayload,
  ILinkRestoredPayload,
} from './link-event-payload.interface';
