export interface DrinkConfigEntity {
  id: string;
  drink_type_id: string;
  drink_subtype_id?: string;
  container_type_id: string;
  volume_id: string;
  default_temp_consume: number;
  min_temp_consume: number;
  max_temp_consume: number;
  time_table_id_1: string;
  time_table_id_2: string;
  time_table_id_3: string;
  is_active: number;
  created_at: number;
  updated_at: number;
}
