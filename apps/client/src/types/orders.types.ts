import type { ORDER_FIELD_KEYS } from 'constants/app.config';
import type { OrderFilters } from 'types/filters.types';
import type { CamelToKebab, CamelToSnake } from '@workspace/core/types/utils';

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
  process: OrderProcessingProps;
}

export type OrderStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface OrderProcessingProps {
  status: OrderStatus;
  estimatedCompletionTime?: string;
  timeRemaining?: number;
}

// The complete order type combining selection fields and base properties
export interface OrderItem {
  id: string; // Unique order ID from backend
  ids: string[]; // All filtered ids // NOTE: not optional ..
  itemNumber: number;
  itemType: ItemType;
  isSelected: boolean;
  filters?: OrderFilters;
  sessionId?: string;
  process: {
    status: OrderStatus;
    estimatedCompletionTime?: string;
    timeRemaining?: number;
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
