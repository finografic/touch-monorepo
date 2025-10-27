import type { SlotItem } from 'types/orders.types';

export interface OrderWithMetadata extends SlotItem {
  id?: string;
  hasSubtypes?: boolean;
  isActive?: boolean;
  metadata?: {
    orderId: string;
    timestamp: string;
    status: string;
    completionTime?: string;
  };
}

export interface Calculation {
  timeTableId?: string;
  adjustmentFactors?: Record<string, number>;
  status: 'cooling' | 'heating';
  temperatureDelta: number;
  estimatedDuration: {
    minutes: number;
    seconds: number;
  };
  recommendations: string[];
}

export interface AdminToolsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
