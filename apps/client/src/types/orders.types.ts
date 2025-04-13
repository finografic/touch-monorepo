import type { DrinkSubtype, DrinkType } from './drinks.types';

// Types for the values of each field
export interface Volume {
  amount: number;
  unit: string;
}

export interface Temperature {
  value: number;
  unit: string;
}

export interface ContainerType {
  id: string;
  name: string;
}

// The fields that are managed by the selection process
export interface OrderSelectionFields {
  drinkType?: DrinkType;
  drinkSubtype?: DrinkSubtype;
  volume?: Volume;
  finalTemperature?: Temperature;
  containerType?: ContainerType;
  initialTemperature?: Temperature;
}

// Base properties that every order has
interface OrderBaseProps {
  itemNumber: number;
  isSelected: boolean;
  isLocked: boolean;
}

// The complete order type combining selection fields and base properties
export interface OrderItem extends OrderBaseProps, OrderSelectionFields {}
