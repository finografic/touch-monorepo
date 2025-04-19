// Re-export API types
export * from './api.types';

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

export interface DrinkVolume {
  id: string;
  name: string;
  valueInMl: number;
  sortOrder: number;
  coolingFactor: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}
