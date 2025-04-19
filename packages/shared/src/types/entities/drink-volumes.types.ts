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
