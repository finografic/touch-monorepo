export interface DrinkVolumeEntity {
  id: string;
  name: string;
  valueInMl: number;
  sortOrder: number;
  coolingFactor: number;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}
