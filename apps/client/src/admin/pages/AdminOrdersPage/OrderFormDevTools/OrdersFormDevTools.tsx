import React, { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { useOrdersFormDevTools } from 'admin/pages/AdminOrdersPage/OrderFormDevTools/useOrdersFormDevTools';
import type { MockDataHandlers } from 'admin/pages/AdminOrdersPage/OrdersForm/orders-form.utils';

import { Button } from 'components/ButtonRadix';

import { useDev } from 'dev-tools/providers/DevProvider';
import type { OrdersFormValues } from '../OrdersForm/OrdersForm.schema';
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
            variant="outline"
            size="2"
            onClick={handlers.handleMockPartial}
            color="default"
          >
            📝 Mock Partial
          </Button>
          <Button
            type="button"
            variant="outline"
            size="2"
            onClick={handlers.handleMockTwoRows}
            color="default"
          >
            🎲 Mock 2 Rows
          </Button>
          <Button type="button" variant="outline" size="2" onClick={handlers.handleMockAll} color="default">
            📝 Mock All
          </Button>
          <Button
            type="button"
            variant="outline"
            size="2"
            onClick={handlers.handleMockAllRows}
            color="default"
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
