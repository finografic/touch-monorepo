export interface TemperatureTableEntity {
  id: string;
  cooling_profile_id: string;
  temperature: number;
  time_a: number;
  time_b: number;
  time_c: number;
}

export interface TemperatureTableEntryEntity {
  id: string;
  cooling_profile_id: string;
  temperature: number;
  time_a: number;
  time_b: number;
  time_c: number;
}
