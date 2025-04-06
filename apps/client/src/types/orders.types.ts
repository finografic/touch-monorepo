import { BeverageSubtype, BeverageType } from './beverages.types';

export type OrderItem = {
  itemNumber: number;
  beverageType?: BeverageType;
  beverageSubtype?: BeverageSubtype;
  isSelected: boolean;
  isLocked: boolean;
};
