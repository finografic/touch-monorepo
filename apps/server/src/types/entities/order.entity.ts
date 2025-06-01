export interface OrderEntity {
  id: string;
  drink_type_name: string;
  drink_subtype_name: string | null;
  volume_name: string;
  container_type_name: string;
  default_temp_consume: number;
  default_temp_freeze: number;
  temperature_profile_id: string;
  is_active: number; // Stored as integer in DB
  created_at: number; // Stored as timestamp in DB
  updated_at: number; // Stored as timestamp in DB
}
