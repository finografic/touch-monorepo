export interface DrinkTypeEntity {
  id: string;
  name: string;
  name_en: string;
  name_es: string;
  name_ca: string;
  has_subtypes: number; // Stored as integer in DB
  default_temp_consume: number;
  default_temp_freeze: number;
  is_active: number; // Stored as integer in DB
  created_at: number; // Stored as timestamp in DB
  updated_at: number; // Stored as timestamp in DB
}

export interface DrinkSubtypeEntity {
  id: string;
  drink_type_id: string;
  name: string;
  name_en: string;
  name_es: string;
  name_ca: string;
  default_temp_consume: number;
  default_temp_freeze: number;
  is_active: number; // Stored as integer in DB
  created_at: number; // Stored as timestamp in DB
  updated_at: number; // Stored as timestamp in DB
}
