import { Button, DataList, Dialog, Flex, IconButton, Tabs, Theme } from '@radix-ui/themes';
import { useOrderSelection } from 'hooks/useOrderSelection';
import { useEffect, useState } from 'react';
import type { OrderItem } from 'types/orders.types';
import { styles } from './DataDialog.styles';
import { OrderFieldKeys } from 'constants/app.config';
import { useAdmin } from 'providers/AdminProvider/AdminContext';
import { ConfigTimer } from 'components/ConfigTimer/ConfigTimer';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useConfigStorage } from 'hooks/useConfigStorage';
import { LanguageSelector } from 'components/LanguageSelector';

// Import the separate components
import { OrderDataList } from './components/OrderDataList';
import { CalculationDataList } from './components/CalculationDataList';
import { MetadataDataList } from './components/MetadataDataList';
import { JsonView } from './components/JsonView';

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

// Configuration data list component
const ConfigDataList = ({ data }: { data: any }) => {
  if (!data) return null;

  const renderValue = (value: any): string => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <DataList.Root>
      {Object.entries(data).map(([key, value]) => (
        <DataList.Item key={key}>
          <DataList.Label className="label">{key}</DataList.Label>
          <DataList.Value className="value">{renderValue(value)}</DataList.Value>
        </DataList.Item>
      ))}
    </DataList.Root>
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

          <div className="dialogContent">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Trigger value="order">Order Selections</Tabs.Trigger>
                {cleanedCalculationData && <Tabs.Trigger value="calculation">Calculations</Tabs.Trigger>}
                {hasMetadata && <Tabs.Trigger value="metadata">Metadata</Tabs.Trigger>}
                <Tabs.Trigger value="config">Stored Configuration</Tabs.Trigger>
                <Tabs.Trigger value="languages">Languages</Tabs.Trigger>
              </Tabs.List>

              <div className="tabContent">
                <Tabs.Content value="order">
                  {viewMode === 'list' ? (
                    <div className="dataList">
                      <OrderDataList data={cleanedOrderData} />
                    </div>
                  ) : (
                    <JsonView data={cleanedOrderData} color="blue" />
                  )}
                </Tabs.Content>

                <Tabs.Content value="calculation">
                  {viewMode === 'list' ? (
                    <div className="dataList">
                      <CalculationDataList data={cleanedCalculationData} />
                    </div>
                  ) : (
                    <JsonView data={cleanedCalculationData} color="amber" />
                  )}
                </Tabs.Content>

                <Tabs.Content value="metadata">
                  {viewMode === 'list' ? (
                    <div className="dataList">
                      <MetadataDataList data={(orders?.[0] as OrderWithMetadata)?.metadata} />
                    </div>
                  ) : (
                    <JsonView data={(orders?.[0] as OrderWithMetadata)?.metadata} color="gray" />
                  )}
                </Tabs.Content>

                <Tabs.Content value="config">
                  <div className="configContent">
                    <ConfigTimer />
                    {viewMode === 'list' ? (
                      <div className="dataList">
                        <ConfigDataList data={storedConfig} />
                      </div>
                    ) : (
                      <JsonView data={storedConfig} color="orange" />
                    )}
                  </div>
                </Tabs.Content>

                <Tabs.Content value="languages">
                  <LanguageSelector />
                </Tabs.Content>
              </div>
            </Tabs.Root>
          </div>

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
        </Dialog.Content>
      </Dialog.Root>
    </Theme>
  );
};
