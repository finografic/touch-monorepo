import React, { useMemo } from 'react';
import { Button } from 'components/Button';
import { useDev } from 'providers/DevProvider';
import type { OrdersFormValues } from '../OrdersForm/OrdersForm.schema';
import { stylesFormValues } from './OrdersFormDevTools.styles';
import { useOrdersFormDevTools } from 'pages/AdminPages/AdminOrdersPage/OrderFormDevTools/useOrdersFormDevTools';
import type { MockDataHandlers } from 'pages/AdminPages/AdminOrdersPage/OrdersForm/orders-form.utils';
import type { UseFormReturn } from 'react-hook-form';

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
          <Button type="button" variant="soft" size="3" onClick={handlers.handleMockPartial} color="info">
            📝 Mock Partial
          </Button>
          <Button type="button" variant="soft" size="3" onClick={handlers.handleMockTwoRows} color="default">
            🎲 Mock 2 Rows
          </Button>
          <Button type="button" variant="soft" size="3" onClick={handlers.handleMockAll} color="info">
            📝 Mock All
          </Button>
          <Button type="button" variant="soft" size="3" onClick={handlers.handleMockAllRows} color="default">
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
