import { Button, Code, DataList, Dialog, Flex, IconButton, Tabs, Theme } from '@radix-ui/themes';
import { useOrderSelection } from 'hooks/useOrderSelection';
import { useEffect, useState } from 'react';
import type { OrderItem } from 'types/orders.types';
import { moduleStyles } from './DataDialog.module.styles';
import { styles } from './DataDialog.styles';
import { OrderFieldKeys, STORAGE_KEYS } from 'constants/app.config';
import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { ConfigTimer } from 'components/ConfigTimer/ConfigTimer';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useConfigStorage } from 'hooks/useConfigStorage';

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

  const { id, hasSubtypes, isActive, isSelected, process, ...cleanOrder } = orders[0];
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
          <DataList.Label css={moduleStyles.label}>Drink Type</DataList.Label>
          <DataList.Value css={moduleStyles.value}>{data.drinkType.displayName}</DataList.Value>
        </DataList.Item>
      )}
      {data.drinkSubtype && (
        <DataList.Item>
          <DataList.Label css={moduleStyles.label}>Subtype</DataList.Label>
          <DataList.Value css={moduleStyles.value}>{data.drinkSubtype.displayName}</DataList.Value>
        </DataList.Item>
      )}
      {data.volume && (
        <DataList.Item>
          <DataList.Label css={moduleStyles.label}>Volume</DataList.Label>
          <DataList.Value css={moduleStyles.value}>{`${data.volume.valueInMl}ml`}</DataList.Value>
        </DataList.Item>
      )}
      {data.containerType && (
        <DataList.Item>
          <DataList.Label css={moduleStyles.label}>Container</DataList.Label>
          <DataList.Value css={moduleStyles.value}>{data.containerType.displayName}</DataList.Value>
        </DataList.Item>
      )}
      {data.initialTemperature && (
        <DataList.Item>
          <DataList.Label css={moduleStyles.label}>Initial Temperature</DataList.Label>
          <DataList.Value css={moduleStyles.value}>
            {`${data.initialTemperature.value}${data.initialTemperature.unit}`}
          </DataList.Value>
        </DataList.Item>
      )}
      {data.finalTemperature && (
        <DataList.Item>
          <DataList.Label css={moduleStyles.label}>Final Temperature</DataList.Label>
          <DataList.Value css={moduleStyles.value}>
            {`${data.finalTemperature.value}${data.finalTemperature.unit}`}
          </DataList.Value>
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
        <DataList.Label css={moduleStyles.label}>Status</DataList.Label>
        <DataList.Value css={moduleStyles.value}>{data.status}</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label css={moduleStyles.label}>Temperature Δ</DataList.Label>
        <DataList.Value css={moduleStyles.value}>
          {data.temperatureDelta}
          °C
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label css={moduleStyles.label}>Duration</DataList.Label>
        <DataList.Value css={moduleStyles.value}>
          {`${data.estimatedDuration.minutes}m ${data.estimatedDuration.seconds}s`}
        </DataList.Value>
      </DataList.Item>
      {data.recommendations?.length > 0 && (
        <DataList.Item>
          <DataList.Label css={moduleStyles.label}>Recommendations</DataList.Label>
          <DataList.Value css={moduleStyles.value}>
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
        <DataList.Label css={moduleStyles.label}>Order ID</DataList.Label>
        <DataList.Value css={moduleStyles.value}>{data.orderId}</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label css={moduleStyles.label}>Timestamp</DataList.Label>
        <DataList.Value css={moduleStyles.value}>{new Date(data.timestamp).toLocaleString()}</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label css={moduleStyles.label}>Status</DataList.Label>
        <DataList.Value css={moduleStyles.value}>{data.status}</DataList.Value>
      </DataList.Item>
      {data.estimatedCompletionTime && (
        <DataList.Item>
          <DataList.Label css={moduleStyles.label}>Estimated Completion</DataList.Label>
          <DataList.Value css={moduleStyles.value}>
            {new Date(data.estimatedCompletionTime).toLocaleString()}
          </DataList.Value>
        </DataList.Item>
      )}
    </DataList.Root>
  );
};

const JsonView = ({ data, color }: { data: any; color: 'blue' | 'amber' | 'gray' | 'orange' }) => {
  if (!data) return null;
  return (
    <Code color={color} css={moduleStyles.jsonView}>
      {JSON.stringify(data, null, 2)}
    </Code>
  );
};

export const DataDialog = () => {
  const { isAdminDialogOpen, setIsAdminDialogOpen } = useAdmin();
  const { orders } = useOrderSelection<OrderWithMetadata>({
    field: OrderFieldKeys.drinkType,
  });
  const [activeTab, setActiveTab] = useState('order');
  const [viewMode, setViewMode] = useState<'json' | 'list'>('json');
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const { loadConfig } = useConfigStorage();

  // Load calculation data from localStorage when orders change
  useEffect(() => {
    if (orders?.[0]?.itemNumber) {
      const storedCalc = localStorage.getItem(`temperatureCalculation_${orders[0].itemNumber}`);
      if (storedCalc) {
        try {
          const parsedCalc = JSON.parse(storedCalc || '{}');
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
  const storedConfig = loadConfig();

  return (
    <Theme appearance="dark" grayColor="sand" accentColor="blue" scaling="110%">
      <Dialog.Root open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <Dialog.Content size="4" css={styles}>
          <Flex justify="between" align="center" mb="4">
            <Dialog.Title size="5">Admin Tools</Dialog.Title>
            <IconButton className="close-button" variant="ghost" onClick={() => setIsAdminDialogOpen(false)}>
              <Cross2Icon width="20" height="20" />
            </IconButton>
          </Flex>

          {/* <Flex justify="end" mb="2">
            <Button
              variant="soft"
              color="gray"
              size="2"
              onClick={() => setViewMode(viewMode === 'json' ? 'list' : 'json')}
            >
              Toggle {viewMode === 'json' ? 'List' : 'JSON'} View
            </Button>
          </Flex> */}

          <div css={moduleStyles.dialogContent}>
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Trigger value="order">Order Selections</Tabs.Trigger>
                {cleanedCalculationData && <Tabs.Trigger value="calculation">Calculations</Tabs.Trigger>}
                {hasMetadata && <Tabs.Trigger value="metadata">Metadata</Tabs.Trigger>}
                <Tabs.Trigger value="config">Stored Configuration</Tabs.Trigger>
              </Tabs.List>

              <div css={moduleStyles.tabContent}>
                <Tabs.Content value="order">
                  {viewMode === 'list' ? (
                    <div css={moduleStyles.dataList}>
                      <OrderDataList data={cleanedOrderData} />
                    </div>
                  ) : (
                    <JsonView data={cleanedOrderData} color="blue" />
                  )}
                </Tabs.Content>

                <Tabs.Content value="calculation">
                  {viewMode === 'list' ? (
                    <div css={moduleStyles.dataList}>
                      <CalculationDataList data={cleanedCalculationData} />
                    </div>
                  ) : (
                    <JsonView data={cleanedCalculationData} color="amber" />
                  )}
                </Tabs.Content>

                <Tabs.Content value="metadata">
                  {viewMode === 'list' ? (
                    <div css={moduleStyles.dataList}>
                      <MetadataDataList data={(orders?.[0] as OrderWithMetadata)?.metadata} />
                    </div>
                  ) : (
                    <JsonView data={(orders?.[0] as OrderWithMetadata)?.metadata} color="gray" />
                  )}
                </Tabs.Content>

                <Tabs.Content value="config">
                  <div css={moduleStyles.configContent}>
                    <ConfigTimer />
                    <JsonView data={storedConfig} color="orange" />
                  </div>
                </Tabs.Content>
              </div>
            </Tabs.Root>
          </div>

          {/* ====================================================================== */}

          <Flex className="footer" justify="end" mb="2" gap="4">
            <Button variant="soft" color="gray" size="2" onClick={() => setIsAdminDialogOpen(false)}>
              OK
            </Button>

            <Button
              variant="soft"
              color="gray"
              size="2"
              onClick={() => setViewMode(viewMode === 'json' ? 'list' : 'json')}
            >
              Toggle {viewMode === 'json' ? 'List' : 'JSON'} View
            </Button>
          </Flex>

          {/*
            <Button
              variant="soft"
              color="gray"
              size="2"
              onClick={() => setViewMode(viewMode === 'json' ? 'list' : 'json')}
            >
              Toggle {viewMode === 'json' ? 'List' : 'JSON'} View
            </Button>
          </Flex> */}

          {/* ====================================================================== */}
        </Dialog.Content>
      </Dialog.Root>
    </Theme>
  );
};
