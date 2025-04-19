export interface DrinkType {
  id: string;
  name: string;
  displayName: string;
  hasSubtypes: boolean;
  defaultConsumptionTime: number;
  defaultFreezeTemp: number;
  isActive: boolean;
}

export interface DrinkSubtype {
  id: string;
  drinkTypeId: string;
  name: string;
  displayName: string;
  isActive: boolean;
}
