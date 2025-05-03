import type { ORDER_FIELD_KEYS } from 'src/config/app.config';
import type { DrinkSubtype, DrinkType } from './models/drink-type.model';
import type { CamelToKebab, CamelToSnake } from './utilities/casing.utils.types';

export type OrderFieldKey = (typeof ORDER_FIELD_KEYS)[number];
export type OrderFieldKeyKebab = CamelToKebab<OrderFieldKey>;
export type OrderFieldKeySnake = CamelToSnake<OrderFieldKey>;

// Base properties that every order has
interface OrderBaseProps {
  itemNumber: number;
  isSelected: boolean;
  isLocked: boolean;
  processStatus: OrderProcessStatus;
}

// The fields that are managed by the selection process
export interface OrderSelectionFields {
  drinkType?: DrinkType;
  drinkSubtype?: DrinkSubtype;
  volume?: Volume;
  containerType?: ContainerType;
  initialTemperature?: Temperature;
  finalTemperature?: Temperature;
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
  unit: string;
}

// The fields that are managed by the selection process
export interface OrderProcessStatus {
  isProcessing: boolean;
  timeRemaining?: number;
  estimatedCompletionTime?: string; // ISO date string for completion time
}

// The complete order type combining selection fields and base properties
export interface OrderItem extends OrderBaseProps, OrderSelectionFields {}
