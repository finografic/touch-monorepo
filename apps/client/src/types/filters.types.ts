import type { FilterKeys, OrderFieldKeys } from 'constants/app.config';
import type { DrinkSubtype, DrinkType } from 'types/models/drink-type.model';
import type { ContainerType, Temperature, Volume } from 'types/orders.types';

// Base interface for all filters
interface BaseFilter {
  id: string;
  name: string;
}

// Specific filter types with lookup information
interface DrinkTypeFilter extends BaseFilter {
  hasSubtypes: boolean;
  defaultTempConsume?: number;
  temperatureProfileId?: string;
  lookup?: { [FilterKeys.drinkTypeName]: string };
}

interface DrinkSubtypeFilter extends BaseFilter {
  defaultTempConsume?: number;
  temperatureProfileId?: string;
  lookup?: { [FilterKeys.drinkSubtypeName]: string };
}

interface VolumeFilter extends BaseFilter {
  lookup?: { [FilterKeys.volumeName]: string };
}

interface ContainerTypeFilter extends BaseFilter {
  lookup?: { [FilterKeys.containerTypeName]: string };
}

interface TemperatureFilter extends BaseFilter {
  value?: number;
  unit?: string;
  lookup?: { [FilterKeys.temperatureName]: string };
}

// Type for individual filter values
export interface OrderFilter {
  value: DrinkType | DrinkSubtype | Volume | ContainerType | Temperature;
  hasSubtypes?: boolean;
}

// The fields that are managed by the selection process
export interface OrderFilters extends Partial<Record<keyof typeof OrderFieldKeys, unknown>> {
  drinkType?: DrinkTypeFilter;
  drinkSubtype?: DrinkSubtypeFilter;
  drinkVolume?: VolumeFilter;
  containerType?: ContainerTypeFilter;
  initialTemperature?: TemperatureFilter;
  finalTemperature?: TemperatureFilter;
}
