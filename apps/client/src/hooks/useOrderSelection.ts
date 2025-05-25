import { useCallback, useEffect, useState } from 'react';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderFieldKey } from 'types/orders.types';

interface UseOrderSelectionProps<T> {
  field: OrderFieldKey;
  initialValue?: T;
}

export function useOrderSelection<T>({ field, initialValue }: UseOrderSelectionProps<T>) {
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

  const handleSelection = useCallback(
    (newValue: T | undefined) => {
      const valueToSet = selectedValue && newValue === selectedValue ? null : newValue || null;
      const updatedOrders = orders.map((order) => ({ ...order, [field]: valueToSet }));
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
