import type { ORDER_FIELD_KEYS } from 'constants/app.config';
import type { OrderFilters } from 'types/filters.types';
import type { CamelToKebab, CamelToSnake } from 'types/utilities/casing.utils.types';

export type OrderFieldKey = (typeof ORDER_FIELD_KEYS)[number];
export type OrderFieldKeyKebab = CamelToKebab<OrderFieldKey>;
export type OrderFieldKeySnake = CamelToSnake<OrderFieldKey>;

// Base properties that every order has
interface OrderBaseProps {
  itemNumber: number;
  isSelected: boolean;
  isLocked: boolean;
  filters: OrderFilters;
  processStatus: OrderProcessStatus;
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

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'error';

// The fields that are managed by the selection process
export interface OrderProcessStatus {
  isProcessing: boolean;
  timeRemaining?: number;
  estimatedCompletionTime?: string; // ISO date string for completion time
}

// The complete order type combining selection fields and base properties
export interface OrderItem extends OrderBaseProps {}
