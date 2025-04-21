import { Button, Code, DataList, Dialog, Flex, ScrollArea, Tabs, Theme } from '@radix-ui/themes';
import { usePageContent } from 'providers/PageContentProvider/PageContentContext';
import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { useState, useEffect } from 'react';
import type { OrderItem } from 'types/orders.types';
import { styles } from './DevDialog.styles';

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

const labelStyles = {
  color: 'var(--accent-9)',
  fontWeight: 600,
  fontSize: '1rem',
} as const;

const OrderDataList = ({ data }: { data: any }) => {
  if (!data) return null;
  return (
    <DataList.Root>
      {data.drinkType && (
        <DataList.Item>
          <DataList.Label css={styles.label}>Drink Type</DataList.Label>
          <DataList.Value css={styles.value}>{data.drinkType.displayName}</DataList.Value>
        </DataList.Item>
      )}
      {data.drinkSubtype && (
        <DataList.Item>
          <DataList.Label css={styles.label}>Subtype</DataList.Label>
          <DataList.Value css={styles.value}>{data.drinkSubtype.displayName}</DataList.Value>
        </DataList.Item>
      )}
      {data.volume && (
        <DataList.Item>
          <DataList.Label css={styles.label}>Volume</DataList.Label>
          <DataList.Value css={styles.value}>{`${data.volume.valueInMl}ml`}</DataList.Value>
        </DataList.Item>
      )}
      {data.containerType && (
        <DataList.Item>
          <DataList.Label css={styles.label}>Container</DataList.Label>
          <DataList.Value css={styles.value}>{data.containerType.displayName}</DataList.Value>
        </DataList.Item>
      )}
      {data.initialTemperature && (
        <DataList.Item>
          <DataList.Label css={styles.label}>Initial Temperature</DataList.Label>
          <DataList.Value
            css={styles.value}
          >{`${data.initialTemperature.value}${data.initialTemperature.unit}`}</DataList.Value>
        </DataList.Item>
      )}
      {data.finalTemperature && (
        <DataList.Item>
          <DataList.Label css={styles.label}>Final Temperature</DataList.Label>
          <DataList.Value
            css={styles.value}
          >{`${data.finalTemperature.value}${data.finalTemperature.unit}`}</DataList.Value>
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
        <DataList.Label css={styles.label}>Status</DataList.Label>
        <DataList.Value css={styles.value}>{data.status}</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label css={styles.label}>Temperature Δ</DataList.Label>
        <DataList.Value css={styles.value}>
          {data.temperatureDelta}
          °C
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label css={styles.label}>Duration</DataList.Label>
        <DataList.Value
          css={styles.value}
        >{`${data.estimatedDuration.minutes}m ${data.estimatedDuration.seconds}s`}</DataList.Value>
      </DataList.Item>
      {data.recommendations?.length > 0 && (
        <DataList.Item>
          <DataList.Label css={styles.label}>Recommendations</DataList.Label>
          <DataList.Value css={styles.value}>
            {data.recommendations.map((rec, index) => (
              <div key={index}>{rec}</div>
            ))}
          </DataList.Value>
        </DataList.Item>
      )}
    </DataList.Root>
  );
};

const MetadataDataList = ({ data }: { data: OrderWithMetadata['metadata'] }) => {
  if (!data) return null;
  return (
    <DataList.Root>
      <DataList.Item>
        <DataList.Label css={styles.label}>Order ID</DataList.Label>
        <DataList.Value css={styles.value}>{data.orderId}</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label css={styles.label}>Timestamp</DataList.Label>
        <DataList.Value css={styles.value}>{new Date(data.timestamp).toLocaleString()}</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label css={styles.label}>Status</DataList.Label>
        <DataList.Value css={styles.value}>{data.status}</DataList.Value>
      </DataList.Item>
      {data.estimatedCompletionTime && (
        <DataList.Item>
          <DataList.Label css={styles.label}>Estimated Completion</DataList.Label>
          <DataList.Value css={styles.value}>
            {new Date(data.estimatedCompletionTime).toLocaleString()}
          </DataList.Value>
        </DataList.Item>
      )}
    </DataList.Root>
  );
};

const JsonView = ({ data, color }: { data: any; color: 'blue' | 'amber' | 'gray' }) => {
  if (!data) return null;
  return (
    <Code color={color} css={styles.jsonView}>
      {JSON.stringify(data, null, 2)}
    </Code>
  );
};

export const DevDialog = () => {
  const { isDevDialogOpen, setIsDevDialogOpen } = usePageContent();
  const { orders } = useOrderSelection<OrderWithMetadata>({
    field: OrderFieldKeys.drinkType,
  });
  const [activeTab, setActiveTab] = useState('order');
  const [viewMode, setViewMode] = useState<'json' | 'list'>('list');
  const [calculation, setCalculation] = useState<Calculation | null>(null);

  // Load calculation data from localStorage when orders change
  useEffect(() => {
    if (orders?.[0]?.itemNumber) {
      const storedCalc = localStorage.getItem(`temperatureCalculation_${orders[0].itemNumber}`);
      if (storedCalc) {
        try {
          const parsedCalc = JSON.parse(storedCalc);
          setCalculation({
            status: parsedCalc.phases[0].description.toLowerCase().includes('cooling')
              ? 'cooling'
              : 'heating',
            temperatureDelta: Math.abs(parsedCalc.phases[0].endTemp - parsedCalc.phases[0].startTemp),
            estimatedDuration: {
              minutes: Math.floor(parsedCalc.estimatedDurationSeconds / 60),
              seconds: parsedCalc.estimatedDurationSeconds % 60,
            },
            recommendations: parsedCalc.recommendations,
            timeTableId: parsedCalc.timeTableId,
          });
        } catch (error) {
          console.error('Error parsing calculation data:', error);
          setCalculation(null);
        }
      } else {
        setCalculation(null);
      }
    }
  }, [orders]);

  const cleanedOrderData = cleanOrderData(orders as OrderWithMetadata[]);
  const cleanedCalculationData = cleanCalculationData(calculation);
  const hasMetadata = (orders?.[0] as OrderWithMetadata)?.metadata;

  return (
    <Theme appearance="dark" grayColor="sand" accentColor="blue" scaling="110%">
      <Dialog.Root open={isDevDialogOpen} onOpenChange={setIsDevDialogOpen}>
        <Dialog.Content size="4" style={{ maxWidth: 720 }}>
          <Dialog.Title size="5">Development Data View</Dialog.Title>
          <Dialog.Description mb="4" size="3">
            Current state of the order flow data
          </Dialog.Description>

          <Flex justify="end" mb="2">
            <Button
              variant="soft"
              color="gray"
              size="2"
              onClick={() => setViewMode(viewMode === 'json' ? 'list' : 'json')}
            >
              Toggle {viewMode === 'json' ? 'List' : 'JSON'} View
            </Button>
          </Flex>

          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Trigger value="order" css={styles.tabTrigger}>
                Order Selections
              </Tabs.Trigger>
              <Tabs.Trigger
                value="calculation"
                disabled={!cleanedCalculationData}
                css={[
                  styles.tabTrigger,
                  cleanedCalculationData ? styles.activeTabTrigger : styles.disabledTabTrigger,
                ]}
              >
                Calculations
              </Tabs.Trigger>
              <Tabs.Trigger
                value="metadata"
                disabled={!hasMetadata}
                css={[styles.tabTrigger, hasMetadata ? styles.activeTabTrigger : styles.disabledTabTrigger]}
              >
                Metadata
              </Tabs.Trigger>
            </Tabs.List>

            <ScrollArea style={{ height: 400 }} scrollbars="vertical">
              <div style={{ padding: '36px 1rem 1rem' }}>
                <Tabs.Content value="order">
                  {viewMode === 'list' ? (
                    <div css={styles.dataList}>
                      <OrderDataList data={cleanedOrderData} />
                    </div>
                  ) : (
                    <JsonView data={cleanedOrderData} color="blue" />
                  )}
                </Tabs.Content>

                <Tabs.Content value="calculation">
                  {viewMode === 'list' ? (
                    <div css={styles.dataList}>
                      <CalculationDataList data={cleanedCalculationData} />
                    </div>
                  ) : (
                    <JsonView data={cleanedCalculationData} color="amber" />
                  )}
                </Tabs.Content>

                <Tabs.Content value="metadata">
                  {viewMode === 'list' ? (
                    <div css={styles.dataList}>
                      <MetadataDataList data={(orders?.[0] as OrderWithMetadata)?.metadata} />
                    </div>
                  ) : (
                    <JsonView data={(orders?.[0] as OrderWithMetadata)?.metadata} color="gray" />
                  )}
                </Tabs.Content>
              </div>
            </ScrollArea>
          </Tabs.Root>

          <Dialog.Close>
            <Button variant="soft" color="gray" mt="4" size="2">
              Close
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </Theme>
  );
};
