import { DrinkSubtype, DrinkType } from './drinks.types';

export type OrderItem = {
  itemNumber: number;
  drinkType?: DrinkType;
  drinkSubtype?: DrinkSubtype;
  isSelected: boolean;
  isLocked: boolean;
};
