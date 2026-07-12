/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Barrel re-exports for every SDUI interface. Keep this
 *   list in alphabetical order so additions are easy to spot in code
 *   review.
 */

export type { ISduiActionContext, ISduiActionHandler } from './sdui-action.interface';
export type {
  ISduiActionDescriptor,
  ISduiFormSchemaRef,
  SduiActionDisplayAs,
  SduiActionTarget,
} from './sdui-action-descriptor.interface';
export type {
  ISduiActionError,
  ISduiActionResponse,
  ISduiAuditRecord,
} from './sdui-action-response.interface';
export type { IBlockRenderer, ITreeRenderEnvironment } from './sdui-block-renderer.interface';
export type { ISduiClientEvent } from './sdui-client-event.interface';
export type { ISduiCluster } from './sdui-cluster.interface';
export type { ISduiCommandContributor } from './sdui-command-contributor.interface';
export type { ISduiCommandDescriptor } from './sdui-command-descriptor.interface';
export type { ISduiConfirmationDescriptor } from './sdui-confirmation-descriptor.interface';
export type { ISduiContributor, SduiContributorKind } from './sdui-contributor.interface';
export type { ISduiContributorContext } from './sdui-contributor-context.interface';
export type { ISduiDocument } from './sdui-document.interface';
export type { ISduiDocumentMeta } from './sdui-document-meta.interface';
export type { ISduiFeatureFlagContributor } from './sdui-feature-flag-contributor.interface';
export type { ISduiKbdDescriptor } from './sdui-kbd-descriptor.interface';
export type { ISduiLayout } from './sdui-layout.interface';
export type { ISduiLayoutRef } from './sdui-layout-ref.interface';
export type {
  ISduiFeatureOptions,
  ISduiModuleOptions,
  SduiCacheBackend,
  SduiLogLevel,
} from './sdui-module-options.interface';
export type { ISduiNavigationContributor } from './sdui-navigation-contributor.interface';
export type { ISduiNavigationItem } from './sdui-navigation-item.interface';
export type {
  ISduiNotificationAudience,
  ISduiNotificationDescriptor,
} from './sdui-notification-descriptor.interface';
export type {
  ISduiPageBuildContext,
  ISduiPageBuilder,
  SduiPageAuth,
} from './sdui-page-builder.interface';
export type { ISduiPageResolveRequest } from './sdui-page-resolve-request.interface';
export type {
  ISduiInlineRateLimitDescriptor,
  ISduiNamedRateLimitDescriptor,
  SduiRateLimitDescriptor,
} from './sdui-rate-limit-descriptor.interface';
export type { ISduiRedirectDescriptor } from './sdui-redirect-descriptor.interface';
export type { ISduiRenderHookContext } from './sdui-render-hook-context.interface';
export type { ISduiRenderHookContributor } from './sdui-render-hook-contributor.interface';
export type {
  ISduiRelationManagerDescriptor,
  ISduiResource,
  ISduiResourceConfig,
  ISduiResourceNavigation,
  ISduiSearchableConfig,
  ISduiSubNavigationItem,
} from './sdui-resource.interface';
export type { ISduiResolveRequest } from './sdui-resolve-request.interface';
export type { ISduiResolveResponse } from './sdui-resolve-response.interface';
export type {
  ISduiSceneBuildContext,
  ISduiSceneBuilder,
  ISduiSceneContent,
} from './sdui-scene.interface';
export type {
  ISduiSearchGroup,
  ISduiSearchHit,
  ISduiSearchResponse,
} from './sdui-search-response.interface';
export type { ISduiSearchRequest } from './sdui-search-request.interface';
export type { ISduiShortcutContributor } from './sdui-shortcut-contributor.interface';
export type { ISduiSubscriptionChannelContributor } from './sdui-subscription-channel-contributor.interface';
export type {
  ISduiDocumentSlotContent,
  ISduiSceneSlotContent,
  ISduiTreeSlotContent,
  SduiSlotContent,
  SduiTreeRoot,
} from './sdui-slot-content.interface';
export type { ISduiSlotDescriptor } from './sdui-slot-descriptor.interface';
export type {
  ISduiStartExportDescriptor,
  SduiInheritedFilters,
  SduiInlineFilters,
} from './sdui-start-export-descriptor.interface';
export type { ISduiStartImportDescriptor } from './sdui-start-import-descriptor.interface';
export type { ISduiToastDescriptor, SduiToastStatus } from './sdui-toast-descriptor.interface';
export type { ISduiWidgetContext } from './sdui-widget-context.interface';
export type { ISduiWidgetDef } from './sdui-widget-def.interface';
export type { ISduiWidgetReference } from './sdui-widget-reference.interface';
export type { ISduiZoneDescriptor } from './sdui-zone-descriptor.interface';

export type {
  ISduiActionInvokedPayload,
  ISduiActionSucceededPayload,
  ISduiActionFailedPayload,
  ISduiDocumentBuiltPayload,
  ISduiDocumentCachedPayload,
  ISduiDocumentInvalidatedPayload,
} from './sdui-event-payloads.interface';
export type {
  ISduiNotificationCreatedPayload,
  ISduiImportPayload,
  ISduiExportPayload,
  ISduiRateLimitExceededPayload,
  ISduiToastClosedPayload,
} from './sdui-cross-cutting-payloads.interface';
