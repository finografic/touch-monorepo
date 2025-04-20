import { Dialog, Tabs, ScrollArea, Button } from '@radix-ui/themes';
import { usePageContent } from 'providers/PageContentProvider/PageContentContext';
import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { useState } from 'react';
import type { OrderItem } from 'types/orders.types';

interface OrderWithMetadata extends OrderItem {
  id?: string;
  hasSubtypes?: boolean;
  isActive?: boolean;
  metadata?: {
    orderId: string;
    timestamp: string;
    status: string;
    estimatedCompletionTime?: string;
  };
}

interface Calculation {
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

const cleanOrderData = (orders: OrderWithMetadata[]) => {
  if (!orders?.[0]) return null;

  const { id, hasSubtypes, isActive, isSelected, isLocked, processStatus, ...cleanOrder } = orders[0];
  return cleanOrder;
};

const cleanCalculationData = (calculation: Calculation | null) => {
  if (!calculation) return null;

  const { timeTableId, adjustmentFactors, ...cleanCalc } = calculation;
  return cleanCalc;
};

export const DevDialog = () => {
  const { isDevDialogOpen, setIsDevDialogOpen } = usePageContent();
  const { orders } = useOrderSelection<OrderWithMetadata>({
    field: OrderFieldKeys.drinkType,
  });
  const [activeTab, setActiveTab] = useState('order');

  // For now, calculation will be null until we implement it
  const calculation: Calculation | null = null;

  const cleanedOrderData = cleanOrderData(orders as OrderWithMetadata[]);
  const cleanedCalculationData = cleanCalculationData(calculation);
  const hasMetadata = (orders?.[0] as OrderWithMetadata)?.metadata;

  return (
    <Dialog.Root open={isDevDialogOpen} onOpenChange={setIsDevDialogOpen}>
      <Dialog.Content size="4" style={{ maxWidth: 600 }}>
        <Dialog.Title>Development Data View</Dialog.Title>
        <Dialog.Description mb="4" size="2">
          Current state of the order flow data
        </Dialog.Description>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="order">Order Selections</Tabs.Trigger>
            <Tabs.Trigger value="calculation" disabled={!cleanedCalculationData}>
              Calculations
            </Tabs.Trigger>
            <Tabs.Trigger value="metadata" disabled={!hasMetadata}>
              Metadata
            </Tabs.Trigger>
          </Tabs.List>

          <ScrollArea style={{ height: 400 }} scrollbars="vertical">
            <Tabs.Content value="order">
              <pre style={{ margin: 0, padding: '1rem' }}>{JSON.stringify(cleanedOrderData, null, 2)}</pre>
            </Tabs.Content>

            <Tabs.Content value="calculation">
              <pre style={{ margin: 0, padding: '1rem' }}>
                {JSON.stringify(cleanedCalculationData, null, 2)}
              </pre>
            </Tabs.Content>

            <Tabs.Content value="metadata">
              <pre style={{ margin: 0, padding: '1rem' }}>
                {JSON.stringify((orders?.[0] as OrderWithMetadata)?.metadata, null, 2)}
              </pre>
            </Tabs.Content>
          </ScrollArea>
        </Tabs.Root>

        <Dialog.Close>
          <Button variant="soft" color="gray" mt="4">
            Close
          </Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};
