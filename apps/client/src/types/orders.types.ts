import type { DrinkType } from './drinks.types';

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

// The main order item type that matches our OrderFieldKeys
export interface OrderItem {
  itemNumber: number;
  drinkType?: DrinkType;
  volume?: Volume;
  finalTemperature?: Temperature;
  containerType?: ContainerType;
  initialTemperature?: Temperature;
  isSelected: boolean;
  isLocked: boolean;
}
