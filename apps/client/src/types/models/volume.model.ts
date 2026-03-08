export interface DrinkVolume {
  id: string;
  name: string;
  translations: Record<string, string>;
  valueInMl: number;
  sortOrder: number;
  coolingFactor: number;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}
