import type { ValidGridSize } from 'types/menu.types';
import type { RelaySlotKind } from 'types/slots.types';
import type { NUM_GRID_ITEMS } from 'config/app';

export type MenuGridSize = typeof NUM_GRID_ITEMS;

export type MenuLayout = MenuGridConfig<MenuGridSize>;
export interface MenuGridConfig<Size extends ValidGridSize> {
  size: Size;
  mainGrid: number[]; // indices 0-8 for main 3x3 grid
  specialGrid: number[]; // indices 9+ for special pads
}

export function createMenuConfig<Size extends ValidGridSize>(config: MenuGridConfig<Size>) {
  return config;
}

export type SlotStatus = 'idle' | 'processing' | 'completed';

export interface SlotMeta {
  /** Relay kind (A/B/C or e.g. ALT for slot 16). */
  slotType: RelaySlotKind;
  slotNumber: number;
  isChecked: boolean;
  status: SlotStatus;
}
