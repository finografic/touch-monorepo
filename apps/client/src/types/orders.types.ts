import type { ORDER_FIELD_KEYS } from 'constants/app.config';
import type { OrderFilters } from 'types/filters.types';
import type { CamelToKebab, CamelToSnake } from '@workspace/types/utils';

export type OrderFieldKey = (typeof ORDER_FIELD_KEYS)[number];
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
  process?: ProcessStatus;
}

export interface ContainerType {
  id: string;
  name: string;
  displayName: string;
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

export type OrderStatus = 'idle' | 'processing' | 'completed' | 'error';

// The fields that are managed by the selection process
export interface OrderProcessStatus {
  isProcessing: boolean;
  timeRemaining?: number;
  estimatedCompletionTime?: string; // ISO date string for completion time
}

export interface ProcessStatus {
  status: OrderStatus;
  estimatedCompletionTime?: string;
  timeRemaining?: number;
}

// The complete order type combining selection fields and base properties
export interface OrderItem extends OrderBaseProps {}
