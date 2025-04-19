export type ContainerTypeEntity = {
  id: string;
  name: string;
  display_name: string;
  thermal_conductivity: number;
  is_active: number; // Stored as integer in DB
  created_at: number; // Stored as timestamp in DB
  updated_at: number; // Stored as timestamp in DB
};
