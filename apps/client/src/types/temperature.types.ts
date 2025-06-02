import type { OrderStatus } from 'types/orders.types';

export enum TemperatureKey {
  Initial = 'initial',
  Final = 'final',
}

export interface Temperature {
  value: number;
  unit: string;
}

export interface TemperatureFilter {
  initial: number;
  final: number;
  name: string;
  duration?: number;
  status?: OrderStatus;
}
