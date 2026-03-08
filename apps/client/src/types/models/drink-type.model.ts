export interface DrinkType {
  id: string;
  name: string;
  translations: Record<string, string>;
  hasSubtypes: boolean;
  defaultTempConsume: number;
  defaultTempFreeze: number;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface DrinkSubtype {
  id: string;
  drinkTypeId: string;
  name: string;
  translations: Record<string, string>;
  defaultTempConsume: number;
  defaultTempFreeze: number;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}
