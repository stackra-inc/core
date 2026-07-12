/**
 * @file sdui-notification-descriptor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Notification descriptor returned by action handlers.
 *   The action executor delegates to
 *   `@stackra/nestjs-notifications` for every channel EXCEPT
 *   `'toast'`, which the renderer surfaces inline.
 */

import type { HeroUIColor } from '../../enums/sdui/heroui-color.enum';
import type { SduiNotificationChannel } from '../../enums/sdui/sdui-notification-channel.enum';
import type { TranslatableText } from '../../types/sdui/translatable-text.type';
import type { ISduiActionDescriptor } from './sdui-action-descriptor.interface';
import type { SduiToastStatus } from './sdui-toast-descriptor.interface';

/**
 * Recipient targeting. Either a specific actor, every actor inside a
 * tenant, or every actor matching a role.
 */
export interface ISduiNotificationAudience {
  readonly ownerId?: string;
  readonly userId?: string;
  readonly role?: string;
}

/**
 * Cross-channel notification dispatched by an action handler.
 */
export interface ISduiNotificationDescriptor {
  /** Notification title (also used as toast title for `'toast'` channels). */
  readonly title: TranslatableText;

  /** Optional body for the notification panel and toast. */
  readonly body?: TranslatableText;

  /** Optional icon name. Resolved by the frontend icon registry. */
  readonly icon?: string;

  /** Optional HeroUI color. */
  readonly color?: HeroUIColor;

  /** Visual status. */
  readonly status?: SduiToastStatus;

  /** Duration for toast channels (`0` = persistent). */
  readonly duration?: number;

  /**
   * Inline actions surfaced on the notification (e.g. `'Undo'`,
   * `'View'`). The renderer mounts these as buttons inside the
   * toast / notification panel.
   */
  readonly actions?: readonly ISduiActionDescriptor[];

  /** Channels the notification dispatches to. */
  readonly channels: readonly SduiNotificationChannel[];

  /** Persist a record in the database for the bell-icon panel. */
  readonly persist?: boolean;

  /** Recipient targeting. Defaults to `{ userId: ctx.user.id }`. */
  readonly audience?: ISduiNotificationAudience;

  /** Optional named toast queue. */
  readonly queue?: string;

  /** Free-form metadata propagated to the transport. */
  readonly metadata?: Readonly<Record<string, unknown>>;
}
