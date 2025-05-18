export interface DrinkTypeEntity {
  id: string;
  name: string;
  display_name: string;
  has_subtypes: number; // Stored as integer in DB
  // default_consumption_temp: number;
  // default_freeze_temp: number;
  is_active: number; // Stored as integer in DB
  created_at: number; // Stored as timestamp in DB
  updated_at: number; // Stored as timestamp in DB
}

export interface DrinkSubtypeEntity {
  id: string;
  drink_type_id: string;
  name: string;
  display_name: string;
  is_active: number; // Stored as integer in DB
  created_at: number; // Stored as timestamp in DB
  updated_at: number; // Stored as timestamp in DB
}
