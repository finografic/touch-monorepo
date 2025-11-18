import type { CamelToKebab, CamelToSnake } from '@workspace/core/types/utils';

import type { OrderFilters } from 'types/filters.types';
import type { FlowTypeValue } from 'types/flow.types';

// ======================================================================== //
// TODO: CONOSLIDATE THESE TYPES with FilterKey

// Separate field key types for better type safety
export type FilterKey =
  | 'mode'
  | 'drinkType'
  | 'drinkSubtype'
  | 'drinkVolume'
  | 'containerType'
  | 'temperature';

export type NavigationFieldKey = 'main';

// ------------------------------------------------------------------------ //

export type SlotFilterKeyKebab = CamelToKebab<FilterKey | NavigationFieldKey>;
export type SlotFilterKeySnake = CamelToSnake<FilterKey | NavigationFieldKey>;

export enum SlotType {
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum SlotSpecial {
  ENF = 'Enfr',
  MTO = 'Mto',
}

// Base properties that every order has
export interface OrderBaseProps {
  slotType: SlotType;
  slotNumber: number;
  isSelected: boolean;
  filters: OrderFilters;
}

export type OrderStatus = 'idle' | 'processing' | 'completed' | 'error' | 'pending';

// The complete order type combining selection fields and base properties
export interface SlotItem {
  id: string; // Unique order ID from backend
  slotNumber: number;
  slotType: SlotType;
  isSelected: boolean;
  filters?: OrderFilters;
  session?: {
    id: string;
    flowType: FlowTypeValue;
  };
}

export interface ContainerType {
  id: string;
  name: string;
}

// Types for the values of each field
export interface Volume {
  amount: number;
  unit: string;
}

export interface Temperature {
  value: number;
  unit: '°C';
}
