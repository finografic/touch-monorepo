export { useCalculateTemperature } from './useCalculateTemperature';
export type {
  CalculateTemperatureRequest,
  CalculateTemperatureResponse,
  TemperaturePhase,
} from './useCalculateTemperature';
export { useGetTemperatureProfiles } from './useGetTemperatureProfiles';
export { useGetTemperatureSettings } from './useGetTemperatureSettings';
export type { GetTemperatureSettingsRequest, TemperatureSettings } from './useGetTemperatureSettings';

export const GET_TEMPERATURE_SETTINGS_QUERYKEY = ['get-temperature-settings'] as const;
export const GET_TEMPERATURE_PROFILES_QUERYKEY = ['get-temperature-profiles'] as const;
