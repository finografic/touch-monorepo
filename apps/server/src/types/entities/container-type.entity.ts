export interface ContainerTypeEntity {
  id: string;
  name: string;
  name_en: string;
  name_es: string;
  name_cat: string;
  thermal_conductivity: number;
  is_active: number; // Stored as integer in DB
  created_at: number; // Stored as timestamp in DB
  updated_at: number; // Stored as timestamp in DB
}
