export interface SupportedLanguageEntity {
  id: string;
  iso_code: string;
  native_name: string;
  display_name: string;
  flag_code: string;
  is_active: boolean; // Stored as integer in DB
  is_default: boolean; // Stored as integer in DB
  sort_order: number; // Stored as integer in DB
  created_at: number; // Stored as timestamp in DB
  updated_at: number; // Stored as timestamp in DB
}
