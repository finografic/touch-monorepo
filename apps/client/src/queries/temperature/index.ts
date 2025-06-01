export { useCalculateTemperature } from './useCalculateTemperature';
export type {
  CalculateTemperatureRequest,
  CalculateTemperatureResponse,
  TemperaturePhase,
} from './useCalculateTemperature';
export { useGetTemperatureSettings } from './useGetTemperatureSettings';
export type { GetTemperatureSettingsRequest, TemperatureSettings } from './useGetTemperatureSettings';

export const GET_TEMPERATURE_PROFILE_QUERYKEY = ['get-temperature-profile'] as const;
export const GET_TEMPERATURE_SETTINGS_QUERYKEY = ['get-temperature-settings'] as const;
