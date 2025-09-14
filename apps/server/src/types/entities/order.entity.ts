export interface OrderEntity {
  id: string;
  mode_id: string;
  drink_type_id: string;
  drink_subtype_id: string | null;
  volume_id: string;
  container_type_id: string;
  temperature_profile_id: string;
  default_temp_consume: number;
  default_temp_freeze: number;
  is_active: number; // Stored as integer in DB
  created_at: number; // Stored as timestamp in DB
  updated_at: number; // Stored as timestamp in DB
}
