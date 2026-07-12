/**
 * @file sdui-confirmation-descriptor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Descriptor for the confirmation dialog rendered before
 *   destructive or expensive actions execute.
 */

import type { HeroUIColor } from '../../enums/sdui/heroui-color.enum';
import type { TranslatableText } from '../../types/sdui/translatable-text.type';

/**
 * Descriptor for the AlertDialog the renderer opens before invoking
 * the action handler.
 */
export interface ISduiConfirmationDescriptor {
  /** Dialog title (typically a question or a strong directive). */
  readonly title: TranslatableText;

  /** Optional body content explaining the consequences. */
  readonly body?: TranslatableText;

  /** Label for the confirm button (defaults to `'common.confirm'`). */
  readonly confirmLabel?: TranslatableText;

  /** Label for the cancel button (defaults to `'common.cancel'`). */
  readonly cancelLabel?: TranslatableText;

  /**
   * Color for the confirm button. Destructive actions should pass
   * `'danger'`; routine confirmations should pass `'accent'`.
   */
  readonly confirmColor?: HeroUIColor;

  /**
   * Whether to require the user to type a free-text token (e.g. the
   * record name) before the confirm button is enabled. Useful for
   * dangerous bulk-deletes.
   */
  readonly requireText?: string;
}
