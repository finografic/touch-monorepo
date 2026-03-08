export interface OrderModel {
  id: string;
  modeId: string;
  drinkTypeId: string;
  drinkSubtypeId: string | null;
  volumeId: string;
  containerTypeId: string;
  defaultTempConsume: number;
  defaultTempFreeze: number;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}
