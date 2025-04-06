// DB Schema types
export type BeverageType = {
  id: string;
  name: string;
  displayName: string;
  hasSubtypes: boolean;
  defaultConsumptionTemp: number;
  defaultFreezeTemp: number;
};

export type BeverageSubtype = {
  id: string;
  beverageTypeId: string;
  name: string;
  displayName: string;
  consumptionTemp: number;
  freezeTemp: number;
};
