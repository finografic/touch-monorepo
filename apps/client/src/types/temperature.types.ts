import type { FilterKeys } from 'constants/filters.constants';

export enum TemperatureKey {
  Initial = 'initial',
  Final = 'final',
}

export interface Temperature {
  value: number;
  unit: string;
}

export interface TemperatureProfile {
  id: string;
  modeId: string;
  temperature: number;
  timeA: number;
  timeB: number;
  timeC: number;
}

export interface TemperatureProfileWithRelations extends TemperatureProfile {
  mode?: {
    id: string;
    // Add other mode fields if needed
  };
}

export interface TemperatureFilter__V1 {
  initial?: number;
  final?: number;
  duration?: number;
  lookup?: { [FilterKeys.temperatureName]: string | number };
}

export interface TemperatureFilter {
  defaultConsume?: number;
  defaultFreeze?: number;
  initial?: number;
  final?: number;
  closestInitialTemperature?: TemperatureProfile['temperature'];
  temperatureProfiles?: TemperatureProfile[];
}
