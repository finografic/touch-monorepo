import { useCallback, useEffect, useState } from 'react';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderFieldKey } from 'types/orders.types';
import type { PadItem } from 'types/ui.types';

interface UseOrderSelectionProps<T> {
  field: OrderFieldKey;
  initialValue?: T;
}

export function usePadSelection<T>({ field, initialValue }: UseOrderSelectionProps<T>) {
  const { orders, setOrders } = useOrders();
  const [selectedValue, setSelectedValue] = useState<T | null>({
    ...(orders[0] || null),
    [field]: initialValue,
  } as T);

  useEffect(() => {
    if (orders.length && initialValue) {
      const updatedOrders = orders.map((order) => ({ ...order, [field]: initialValue }));
      setOrders(updatedOrders);
    }
  }, [initialValue]);

  const __isValid: boolean = Object.keys(orders[0] || {}).length > 0 ? Boolean(field in orders[0]) : false;

  // log('__DEV: isValid', 'hotpink', { TEST: orders[0], initialValue, isValid });

  const handleSelection = useCallback(
    ({ pad, fieldKey }: { pad: PadItem; fieldKey: OrderFieldKey }) => {
      const valueToSet = selectedValue && pad.id === selectedValue ? null : pad.id || null;
      const updatedOrders = orders.map((order) => ({ ...order, [fieldKey]: valueToSet }));
      setOrders(updatedOrders);
      setSelectedValue(valueToSet);
    },
    [field, orders, selectedValue, setOrders],
  );

  return {
    selectedValue,
    handleSelection,
    orders,
    setOrders,
    hasValidSelection: selectedValue !== null,
  };
}
