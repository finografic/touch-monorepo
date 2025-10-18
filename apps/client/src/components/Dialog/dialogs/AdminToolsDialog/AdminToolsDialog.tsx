import { useEffect, useState } from 'react';

import { ConfigTimer } from 'components/ConfigTimer/ConfigTimer';
import { DataDump } from 'components/DataDump/DataDump';
import { CalculationDataList } from 'components/DataList/CalculationDataList/CalculationDataList';
import { ConfigDataList } from 'components/DataList/ConfigDataList/ConfigDataList';
import { MetadataDataList } from 'components/DataList/MetadataDataList/MetadataDataList';
import { OrderDataList } from 'components/DataList/OrderDataList/OrderDataList';
import { ROUTE_FILTER_KEYS } from 'config/app';
import { useConfigStorage } from 'hooks/useConfigStorage';
import { useOrderSelection } from 'hooks/useOrderSelection';
import { GenericDialog } from '../../GenericDialog';
import type { DialogConfig } from '../../GenericDialog.types';
// Local imports
import type { AdminToolsDialogProps, Calculation, OrderWithMetadata } from './AdminToolsDialog.types';
import { cleanCalculationData, cleanOrderData, loadCalculationFromStorage } from './AdminToolsDialog.utils';

export const AdminToolsDialog = ({ isOpen, onClose }: AdminToolsDialogProps) => {
  const { orders } = useOrderSelection<OrderWithMetadata>({
    field: ROUTE_FILTER_KEYS.drinkType,
  });
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [viewMode, setViewMode] = useState<'json' | 'list'>('json');
  const { loadConfig } = useConfigStorage();

  // Safe storage access helper
  function safeLoadCalculationFromStorage(slotNumber: string): Calculation | null {
    try {
      return loadCalculationFromStorage(slotNumber) ?? null;
    } catch (err) {
      console.warn('[AdminToolsDialog] Failed to load calculation from storage:', err);
      return null;
    }
  }

  function safeLoadConfig() {
    try {
      return loadConfig() ?? {};
    } catch (err) {
      console.warn('[AdminToolsDialog] Failed to load config from storage:', err);
      return {};
    }
  }

  useEffect(
    function handleOrdersChangeAndCalculateData() {
      if (orders?.[0]?.slotNumber) {
        const loadedCalculation = safeLoadCalculationFromStorage(String(orders[0].slotNumber));
        setCalculation(loadedCalculation);
      } else {
        setCalculation(null);
      }
    },
    [orders],
  );

  const cleanedOrderData = cleanOrderData((orders ?? []) as OrderWithMetadata[]);
  const cleanedCalculationData = cleanCalculationData(calculation);
  const hasMetadata = (orders?.[0] as OrderWithMetadata)?.metadata ?? null;
  const storedConfig = safeLoadConfig();

  // Build tabs dynamically based on available data
  const tabs = [
    {
      id: 'order',
      label: 'Order Selections',
      content:
        viewMode === 'list' ? (
          <div className="data-list">
            <OrderDataList data={cleanedOrderData} />
          </div>
        ) : (
          <DataDump data={cleanedOrderData} color="blue" />
        ),
    },
  ];

  // Add calculation tab if data exists
  if (cleanedCalculationData) {
    tabs.push({
      id: 'calculation',
      label: 'Calculations',
      content:
        viewMode === 'list' ? (
          <div className="data-list">
            <CalculationDataList data={cleanedCalculationData} />{' '}
          </div>
        ) : (
          <DataDump data={cleanedCalculationData} color="amber" />
        ),
    });
  }

  // Add metadata tab if exists
  if (hasMetadata) {
    tabs.push({
      id: 'metadata',
      label: 'Metadata',
      content:
        viewMode === 'list' ? (
          <div className="data-list">
            <MetadataDataList data={(orders?.[0] as OrderWithMetadata)?.metadata} />
          </div>
        ) : (
          <DataDump data={(orders?.[0] as OrderWithMetadata)?.metadata} color="gray" />
        ),
    });
  }

  // Add config tab
  tabs.push({
    id: 'config',
    label: 'Stored Configuration',
    content: (
      <div className="configContent">
        <ConfigTimer />
        {viewMode === 'list' ? (
          <div className="data-list">
            <ConfigDataList data={storedConfig} />
          </div>
        ) : (
          <DataDump data={storedConfig} color="orange" />
        )}
      </div>
    ),
  });

  const config: DialogConfig = {
    title: 'Admin Tools',
    size: '4',
    maxWidth: '50vw',
    maxHeight: '85vh',
    minWidth: '600px',
    minHeight: '66vh',
    theme: {
      appearance: 'dark',
      accentColor: 'blue',
      grayColor: 'sand',
      scaling: '110%',
    },
    tabs,
    footer: {
      primaryButton: {
        label: 'OK',
        onClick: onClose,
        variant: 'soft',
        color: 'gray',
      },
      secondaryButton: {
        label: `Toggle ${viewMode === 'json' ? 'List' : 'JSON'} View`,
        onClick: () => setViewMode(viewMode === 'json' ? 'list' : 'json'),
        variant: 'soft',
        color: 'gray',
      },
    },
  };

  return <GenericDialog isOpen={isOpen} onClose={onClose} config={config} />;
};
