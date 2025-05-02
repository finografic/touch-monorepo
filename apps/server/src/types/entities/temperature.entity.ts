export interface TemperatureTableEntity {
  id: string;
  table_number: string;
  description: string | null;
  element_type: number;
  is_active: number; // Stored as integer in DB
  created_at: number; // Stored as timestamp in DB
  updated_at: number; // Stored as timestamp in DB
}

export interface TemperatureTableEntryEntity {
  id: string;
  table_id: string;
  temperature: number;
  time_minutes: number;
  sort_order: number;
  is_active: number; // Stored as integer in DB
  created_at: number; // Stored as timestamp in DB
  updated_at: number; // Stored as timestamp in DB
}
