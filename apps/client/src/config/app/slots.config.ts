import type { SlotItem } from 'types/slot-config.types';
import { type SelectedSlotItem, type RelaySlotKind, SlotSpecial, SlotType } from 'types/slots.types';

export const NUM_ROWS_DEFAULT = 3; // Standard grid (3+ columns)
export const NUM_RELAYS = 16; // Always 16 total slots
export const MIN_COLUMNS = 1; // Allow 1×2 or 2×2 smaller layouts
export const MAX_COLUMNS = 4;

export const ALT_SLOT_NUMBER = 16;

/**
 * Main-page slot kind for UI / selection: relay slots use {@link SlotType};
 * the ALT relay (default slot 16) always uses {@link SlotSpecial.ALT} regardless of API shape.
 */
export function resolveMainPageSlotType(slotNumber: number, slotType: SlotType): RelaySlotKind {
  if (slotNumber === ALT_SLOT_NUMBER) return SlotSpecial.ALT;
  return slotType;
}

/** When columns < 3 we use 2 rows (1×2 or 2×2); when >= 3 we use NUM_ROWS_DEFAULT. */
export const getEffectiveRows = (columns: number): number => (columns < 3 ? 2 : NUM_ROWS_DEFAULT);

// ─── Grid Level System ───────────────────────────────────────────────────────
// Five discrete grid sizes stepped through by Add/Remove Column buttons.
//   Level 0 → XSmall  1×2  ( 2 grid slots + 1 special)
//   Level 1 → Small   2×2  ( 4 grid slots + 1 special)
//   Level 2 → Medium  2×3  ( 6 grid slots + 1 special)
//   Level 3 → Large   3×3  ( 9 grid slots + 1 special)
//   Level 4 → XLarge  4×3  (12 grid slots + 1 special)
// Special slots (grid overlay, alt) are only visible at levels 3–4 (≥3 columns).
// ─────────────────────────────────────────────────────────────────────────────

export type GridLevel = 0 | 1 | 2 | 3 | 4;

const GRID_LEVEL_DIMENSIONS: Record<GridLevel, { columns: number; rows: number }> = {
  0: { columns: 1, rows: 2 },
  1: { columns: 2, rows: 2 },
  2: { columns: 2, rows: 3 },
  3: { columns: 3, rows: 3 },
  4: { columns: 4, rows: 3 },
};

/** Returns { columns, rows } for the given level. */
export const getGridDimensions = (level: GridLevel): { columns: number; rows: number } =>
  GRID_LEVEL_DIMENSIONS[level];

/** Derives the appropriate level from active slot count (the ALT slot is excluded). */
export const getGridLevelFromSlotCount = (activeSlotCount: number): GridLevel => {
  const gridSlots = Math.max(0, activeSlotCount - 1); // exclude special/alt slot
  if (gridSlots <= 2) return 0;
  if (gridSlots <= 4) return 1;
  if (gridSlots <= 6) return 2;
  if (gridSlots <= 9) return 3;
  return 4;
};

export const GRID_LEVEL_NAMES: Record<GridLevel, string> = {
  0: 'XSmall (1×2)',
  1: 'Small (2×2)',
  2: 'Medium (2×3)',
  3: 'Large (3×3)',
  4: 'XLarge (4×3)',
};

export const INITIAL_SLOT_ITEM: SelectedSlotItem = {
  id: '',
  slotType: SlotType.A,
  slotNumber: 0,
  isSelected: false,
  filters: {},
  session: undefined,
};

export const DEFAULT_SLOTS_CONFIG: SlotItem[] = [
  // export const DEFAULT_SLOTS_CONFIG: Partial<SlotConfiguration>[] = [
  { slotType: SlotType.A, slotNumber: 1, isActive: true },
  { slotType: SlotType.B, slotNumber: 2, isActive: true },
  { slotType: SlotType.B, slotNumber: 3, isActive: true },
  { slotType: SlotType.B, slotNumber: 4, isActive: true },
  { slotType: SlotType.B, slotNumber: 5, isActive: true },
  { slotType: SlotType.B, slotNumber: 6, isActive: true },
  { slotType: SlotType.B, slotNumber: 7, isActive: true },
  { slotType: SlotType.B, slotNumber: 8, isActive: true },
  { slotType: SlotType.B, slotNumber: 9, isActive: true },
  { slotType: SlotType.C, slotNumber: 10, isActive: false },
  { slotType: SlotType.B, slotNumber: 11, isActive: false },
  { slotType: SlotType.B, slotNumber: 12, isActive: false },
  { slotType: SlotType.C, slotNumber: 13, isActive: false },
  { slotType: SlotType.B, slotNumber: 14, isActive: false },
  { slotType: SlotType.B, slotNumber: 15, isActive: false },
  { slotType: SlotSpecial.ALT, slotNumber: ALT_SLOT_NUMBER, isActive: false },
];
