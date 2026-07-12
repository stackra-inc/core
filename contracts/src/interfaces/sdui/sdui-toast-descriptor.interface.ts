/**
 * @file sdui-toast-descriptor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Toast descriptor returned by action handlers. The
 *   renderer maps these 1:1 onto HeroUI `Toast` options. SDUI does
 *   NOT use `react-hot-toast`, `react-toastify`, or `sonner` —
 *   HeroUI Toast is the only sanctioned toast surface.
 */

import type { HeroUIColor } from '../../enums/sdui/heroui-color.enum';
import type { TranslatableText } from '../../types/sdui/translatable-text.type';

/**
 * Toast status indicators map onto HeroUI Toast variants. Each value
 * resolves to a documented HeroUI color + icon combination.
 */
export type SduiToastStatus = 'info' | 'success' | 'warning' | 'danger' | 'default';

/**
 * One toast notification. Pushed onto the `toast` slot's stack.
 */
export interface ISduiToastDescriptor {
  /** Primary text — typically a short summary of the result. */
  readonly title: TranslatableText;

  /** Optional secondary text providing details. */
  readonly body?: TranslatableText;

  /** Visual status — drives color and icon. */
  readonly status?: SduiToastStatus;

  /** Override the status's default color. */
  readonly color?: HeroUIColor;

  /** Optional icon name. Resolved by the frontend icon registry. */
  readonly icon?: string;

  /**
   * Duration in milliseconds (`0` = persistent). Defaults to the
   * documented HeroUI Toast timeout for the chosen status.
   */
  readonly duration?: number;

  /**
   * Optional named queue (e.g. `'bottom-right'`). The renderer
   * dispatches the toast to the documented HeroUI Toast queue.
   */
  readonly queue?: string;
}
