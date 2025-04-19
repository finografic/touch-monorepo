export interface ApiDrinkVolume {
  id: string;
  name: string;
  value_in_ml: number;
  sort_order: number;
  cooling_factor: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
