import type { OrderStatus } from 'types/orders.types';

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
  coolingProfileId: string;
  temperature: number;
  timeA: number;
  timeB: number;
  timeC: number;
}

export interface TemperatureProfileWithRelations extends TemperatureProfile {
  coolingProfile?: {
    id: string;
    // Add other cooling profile fields if needed
  };
}

export interface TemperatureFilter {
  initial?: number;
  final?: number;
  duration?: number;
  status?: 'pending' | 'in_progress' | 'completed' | 'error';
}
