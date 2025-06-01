import type { DrinkSubtype, DrinkType } from 'types/models/drink-type.model';
import type { ContainerType, OrderFieldKey, Temperature, Volume } from 'types/orders.types';

export interface OrderFilter {
  value: DrinkType | DrinkSubtype | Volume | ContainerType | Temperature;
  hasSubtypes?: boolean;
}

// The fields that are managed by the selection process
export interface OrderFilters extends Partial<Record<OrderFieldKey, unknown>> {
  drinkType?: { name: string; id: string; hasSubtypes: boolean };
  drinkSubtype?: { name: string; id: string };
  volume?: { name: string; id: string };
  containerType?: { name: string; id: string };
  initialTemperature?: { name: string; id: string };
  finalTemperature?: { name: string; id: string };
}
