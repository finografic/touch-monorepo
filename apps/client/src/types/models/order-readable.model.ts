import type { TemperatureProfile } from 'types/temperature.types';

export interface OrdersReadableView {
  id: string;
  modeId: string;
  mode: string;
  drinkType: string;
  drinkSubtype: string | null;
  volume: string;
  containerType: string;
  temperatureProfile: string;
  defaultTempConsume: number;
  defaultTempFreeze: number;
  isActive: number;
  createdAt: number | null;
  updatedAt: number | null;
}

export type OrderReadableModel = OrdersReadableView & {
  temperatureProfiles?: TemperatureProfile[];
  timeRows?: Array<{
    temperature: number;
    timeA: number;
    timeB: number;
    timeC: number;
  }>;
};
