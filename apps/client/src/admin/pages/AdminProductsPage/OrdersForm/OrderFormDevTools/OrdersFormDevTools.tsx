import React, { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { MockDataHandlers } from 'admin/pages/AdminProductsPage/OrdersForm/mock-orders.utils';
import { useOrdersFormDevTools } from 'admin/pages/AdminProductsPage/OrdersForm/OrderFormDevTools/useOrdersFormDevTools';
import { Button } from '@finografic/design-system/components';

import { useDev } from 'dev-tools/providers/DevProvider';
import type { OrdersFormValues } from '../OrdersForm.schema';
import { stylesFormValues } from './OrdersFormDevTools.styles';

interface OrdersFormDevToolsProps {
  formValues: OrdersFormValues;
  methods: UseFormReturn<OrdersFormValues>;
  mockDataHandlers: MockDataHandlers;
  canAddRow: boolean;
  onAddRow: () => void;
}

export const OrdersFormDevTools: React.FC<OrdersFormDevToolsProps> = ({
  formValues,
  methods,
  mockDataHandlers,
  canAddRow,
  onAddRow,
}) => {
  const { isDevToolsVisible } = useDev();
  const handlers = useOrdersFormDevTools({
    methods,
    mockDataHandlers,
    formValues,
    onAddRow,
    canAddRow,
  });

  const filteredFormValues = useMemo(
    () => ({
      ...formValues,
      timeRows: formValues.timeRows?.filter(
        (row) =>
          row.temperature !== undefined ||
          row.timeA !== undefined ||
          row.timeB !== undefined ||
          row.timeC !== undefined,
      ),
    }),
    [formValues],
  );

  if (!isDevToolsVisible) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1rem' }}>
      {/* Dev Tools Buttons */}
      {isDevToolsVisible && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handlers.handleMockPartial}
            palette="default"
          >
            📝 Mock Partial
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handlers.handleMockTwoRows}
            palette="default"
          >
            🎲 Mock 2 Rows
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={handlers.handleMockAll} palette="default">
            📝 Mock All
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handlers.handleMockAllRows}
            palette="default"
          >
            🎲 Mock All Rows
          </Button>
        </>
      )}

      {/* <div css={stylesFormValues} className="dev-form-values">
        <pre>{JSON.stringify(filteredFormValues, null, 2)}</pre>
      </div> */}
    </div>
  );
};
