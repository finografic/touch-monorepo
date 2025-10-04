import type { ORDER_FIELD_KEYS } from 'config/app';
import type { OrderFilters } from 'types/filters.types';
import type { CamelToKebab, CamelToSnake } from '@workspace/core/types/utils';
import type { FlowTypeValue } from 'types/flow.types';

// Separate field key types for better type safety
export type FilterFieldKey = 'drinkType' | 'drinkSubtype' | 'drinkVolume' | 'containerType' | 'temperature';
export type NavigationFieldKey = 'main';
export type SlotFilterKey = FilterFieldKey | NavigationFieldKey;
export type SlotFilterKeyKebab = CamelToKebab<SlotFilterKey>;
export type SlotFilterKeySnake = CamelToSnake<SlotFilterKey>;

export enum SlotType {
  A = 'A',
  B = 'B',
  C = 'C',
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
  ids: string[]; // All filtered ids // NOTE: not optional ..
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
  nameEn: string;
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
