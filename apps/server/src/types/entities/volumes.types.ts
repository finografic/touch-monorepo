export type { DrinkSubtypeEntity, DrinkTypeEntity } from './drink-types.types';

export type VolumeEntity = {
  id: string;
  name: string;
  value_in_ml: number;
  sort_order: number;
  cooling_factor: number;
  is_active: number;
  created_at: number;
  updated_at: number;
};
