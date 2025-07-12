export interface OrderReadableEntity {
  id: string;
  mode_id: string;
  drink_type: string;
  drink_subtype: string | null;
  volume: string;
  container_type: string;
  temperature_profile: string;
  default_temp_consume: number;
  default_temp_freeze: number;
  is_active: number; // Stored as integer in DB
  created_at: number; // Stored as timestamp in DB
  updated_at: number; // Stored as timestamp in DB
}
