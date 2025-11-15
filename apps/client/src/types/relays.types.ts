import type { SlotType } from 'types/slots.types';

export interface RelayConfig {
  id: string;
  slotNumber: number;
  slotType: SlotType;
  relayNumber: number | null;
  isOn: boolean;
}
