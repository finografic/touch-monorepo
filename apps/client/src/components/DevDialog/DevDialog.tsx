import { Dialog, Tabs, ScrollArea, Button, Theme, DataList, Code, Flex } from '@radix-ui/themes';
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

const OrderDataList = ({ data }: { data: any }) => {
  if (!data) return null;
  return (
    <DataList.Root>
      {data.drinkType && (
        <DataList.Item>
          <DataList.Label color="blue" highContrast>
            Drink Type
          </DataList.Label>
          <DataList.Value>{data.drinkType.displayName}</DataList.Value>
        </DataList.Item>
      )}
      {data.drinkSubtype && (
        <DataList.Item>
          <DataList.Label color="blue" highContrast>
            Subtype
          </DataList.Label>
          <DataList.Value>{data.drinkSubtype.displayName}</DataList.Value>
        </DataList.Item>
      )}
      {data.volume && (
        <DataList.Item>
          <DataList.Label color="blue" highContrast>
            Volume
          </DataList.Label>
          <DataList.Value>{`${data.volume.amount}${data.volume.unit}`}</DataList.Value>
        </DataList.Item>
      )}
      {data.containerType && (
        <DataList.Item>
          <DataList.Label color="blue" highContrast>
            Container
          </DataList.Label>
          <DataList.Value>{data.containerType.displayName}</DataList.Value>
        </DataList.Item>
      )}
    </DataList.Root>
  );
};

const CalculationDataList = ({ data }: { data: Calculation | null }) => {
  if (!data) return null;
  return (
    <DataList.Root>
      <DataList.Item>
        <DataList.Label color="amber" highContrast>
          Status
        </DataList.Label>
        <DataList.Value>{data.status}</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label color="amber" highContrast>
          Temperature Δ
        </DataList.Label>
        <DataList.Value>{data.temperatureDelta}°C</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label color="amber" highContrast>
          Duration
        </DataList.Label>
        <DataList.Value>{`${data.estimatedDuration.minutes}m ${data.estimatedDuration.seconds}s`}</DataList.Value>
      </DataList.Item>
    </DataList.Root>
  );
};

export const DevDialog = () => {
  const { isDevDialogOpen, setIsDevDialogOpen } = usePageContent();
  const { orders } = useOrderSelection<OrderWithMetadata>({
    field: OrderFieldKeys.drinkType,
  });
  const [activeTab, setActiveTab] = useState('order');
  const [viewMode, setViewMode] = useState<'json' | 'list'>('list');

  // For now, calculation will be null until we implement it
  const calculation: Calculation | null = null;

  const cleanedOrderData = cleanOrderData(orders as OrderWithMetadata[]);
  const cleanedCalculationData = cleanCalculationData(calculation);
  const hasMetadata = (orders?.[0] as OrderWithMetadata)?.metadata;

  return (
    <Theme appearance="dark" grayColor="sand" accentColor="blue">
      <Dialog.Root open={isDevDialogOpen} onOpenChange={setIsDevDialogOpen}>
        <Dialog.Content size="4" style={{ maxWidth: 720 }}>
          <Dialog.Title>Development Data View</Dialog.Title>
          <Dialog.Description mb="4" size="2">
            Current state of the order flow data
          </Dialog.Description>

          <Flex justify="end" mb="2">
            <Button
              variant="soft"
              color="gray"
              size="1"
              onClick={() => setViewMode(viewMode === 'json' ? 'list' : 'json')}
            >
              Toggle {viewMode === 'json' ? 'List' : 'JSON'} View
            </Button>
          </Flex>

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
              <div style={{ padding: '1rem' }}>
                <Tabs.Content value="order">
                  {viewMode === 'list' ? (
                    <OrderDataList data={cleanedOrderData} />
                  ) : (
                    <Code color="blue" style={{ display: 'block' }}>
                      {JSON.stringify(cleanedOrderData, null, 2)}
                    </Code>
                  )}
                </Tabs.Content>

                <Tabs.Content value="calculation">
                  {viewMode === 'list' ? (
                    <CalculationDataList data={cleanedCalculationData} />
                  ) : (
                    <Code color="amber" style={{ display: 'block' }}>
                      {JSON.stringify(cleanedCalculationData, null, 2)}
                    </Code>
                  )}
                </Tabs.Content>

                <Tabs.Content value="metadata">
                  <Code color="gray" style={{ display: 'block' }}>
                    {JSON.stringify((orders?.[0] as OrderWithMetadata)?.metadata, null, 2)}
                  </Code>
                </Tabs.Content>
              </div>
            </ScrollArea>
          </Tabs.Root>

          <Dialog.Close>
            <Button variant="soft" color="gray" mt="4">
              Close
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </Theme>
  );
};
