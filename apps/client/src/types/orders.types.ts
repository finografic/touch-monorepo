import type { DrinkSubtype, DrinkType } from 'types/models/drink-type.model';

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
}

// The complete order type combining selection fields and base properties
export interface OrderItem extends OrderBaseProps, OrderSelectionFields {}
