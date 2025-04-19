export interface ApiResponse {
  message: string;
  timestamp: number;
}

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

export interface DrinkTypeResponse extends ApiResponse {
  data: DrinkType;
}

export interface DrinkTypesResponse extends ApiResponse {
  data: DrinkType[];
}
