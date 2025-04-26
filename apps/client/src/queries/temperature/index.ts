export { useCalculateTemperature } from './useCalculateTemperature';
export { useGetTemperatureSettings } from './useGetTemperatureSettings';
export type {
  CalculateTemperatureRequest,
  CalculateTemperatureResponse,
  TemperaturePhase,
} from './useCalculateTemperature';
export type { TemperatureSettings, GetTemperatureSettingsRequest } from './useGetTemperatureSettings';

export const GET_TEMPERATURE_SETTINGS_QUERYKEY = ['get-temperature-settings'] as const;
