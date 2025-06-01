import type { DataEntry, DataType } from 'types/data.types';
import type { ModelBaseProps } from 'types/base.types';

// Response data type for orders
export interface OrderModel extends DataEntry {
  id: string;
  drinkTypeName: string;
  drinkSubtypeName: string | null;
  volumeName: string;
  containerTypeName: string;
  defaultTempConsume: number;
  defaultTempFreeze: number;
  temperatureProfileId: string;
  isActive: boolean;
  createdAt: number; // Unix timestamp from server
  updatedAt: number; // Unix timestamp from server
  [key: string]: DataType | DataType[] | Record<string, DataType> | DataEntry;
}
