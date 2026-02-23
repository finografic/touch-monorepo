// utils/slot-grid-layout.ts

export interface SlotGridLayoutInput<TSlot> {
  slots: TSlot[];
  columns: number;
  rows: number;

  getSlotNumber: (slot: TSlot) => number;
  isActive: (slot: TSlot) => boolean;

  showSpecialSlot: boolean;
  showSpecialAltSlot: boolean;
}

export interface SlotGridLayout<TSlot> {
  /**
   * Slots rendered inside the main grid.
   * Keyed by slotNumber for O(1) lookup during render.
   */
  regularSlots: Map<number, TSlot>;

  /** The primary special slot (overflow slot). */
  primarySpecialSlot: TSlot | null;

  /** Alt slot replaces primary position. */
  showAltInPrimary: boolean;

  /** Alt slot rendered in second special position. */
  showSecondaryAlt: boolean;
}

export function resolveSlotGridLayout<TSlot>(input: SlotGridLayoutInput<TSlot>): SlotGridLayout<TSlot> {
  const { slots, columns, rows, getSlotNumber, isActive, showSpecialSlot, showSpecialAltSlot } = input;

  const activeSlots = slots.filter(isActive);
  const gridCount = columns * rows;

  // Build O(1) lookup map for grid rendering
  const regularSlots = new Map<number, TSlot>();

  for (const slot of activeSlots.slice(0, gridCount)) {
    regularSlots.set(getSlotNumber(slot), slot);
  }

  const lastSlot = activeSlots[gridCount] ?? null;

  return {
    regularSlots,
    primarySpecialSlot: showSpecialSlot && lastSlot ? lastSlot : null,

    showAltInPrimary: !showSpecialSlot && showSpecialAltSlot,

    showSecondaryAlt: showSpecialSlot && showSpecialAltSlot,
  };
}
