/**
 * @file sdui-slot-descriptor.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Describes a single slot exposed by a layout — its
 *   name, whether content is required, and whether the slot accepts
 *   a single item or an array of items. Used by `ISduiLayout.slots()`
 *   to enumerate the layout's surface for the validator and tooling.
 */

/**
 * Static description of one slot in a layout's slot map.
 *
 * @example
 * ```ts
 * { name: 'sidebar', required: false, multi: false }
 * { name: 'drawer',  required: false, multi: true  }  // stackable overlays
 * { name: 'main',    required: true,  multi: false }
 * ```
 */
export interface ISduiSlotDescriptor {
  /** Slot identifier referenced by document `slots[name]`. */
  readonly name: string;

  /**
   * Whether the document MUST fill this slot. The assembler emits a
   * placeholder + warning when a required slot is missing.
   */
  readonly required: boolean;

  /**
   * Whether the slot accepts a single value or a stackable array of
   * values. Multi slots are used for drawer / modal / toast stacks.
   */
  readonly multi: boolean;

  /**
   * Optional human-readable description rendered in the SDUI registry
   * tooling.
   */
  readonly description?: string;
}
