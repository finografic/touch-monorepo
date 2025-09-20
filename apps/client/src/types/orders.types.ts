import type { ORDER_FIELD_KEYS } from 'constants/app.config';
import type { OrderFilters } from 'types/filters.types';
import type { CamelToKebab, CamelToSnake } from '@workspace/core/types/utils';
import type { FlowTypeValue } from 'types/flow.types';

// Separate field key types for better type safety
export type FilterFieldKey = 'drinkType' | 'drinkSubtype' | 'drinkVolume' | 'containerType' | 'temperature';
export type NavigationFieldKey = 'main';
export type OrderFieldKey = FilterFieldKey | NavigationFieldKey;
export type OrderFieldKeyKebab = CamelToKebab<OrderFieldKey>;
export type OrderFieldKeySnake = CamelToSnake<OrderFieldKey>;

export enum ItemType {
  A = 'A',
  B = 'B',
  C = 'C',
}

// Base properties that every order has
export interface OrderBaseProps {
  itemType: ItemType;
  itemNumber: number;
  isSelected: boolean;
  filters: OrderFilters;
}

export type OrderStatus = 'idle' | 'processing' | 'completed' | 'error' | 'pending';

// The complete order type combining selection fields and base properties
export interface OrderItem {
  id: string; // Unique order ID from backend
  ids: string[]; // All filtered ids // NOTE: not optional ..
  itemNumber: number;
  itemType: ItemType;
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
