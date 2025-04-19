export interface DrinkType {
  id: string;
  name: string;
  displayName: string;
  hasSubtypes: boolean;
  defaultConsumptionTemp: number;
  defaultFreezeTemp: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
