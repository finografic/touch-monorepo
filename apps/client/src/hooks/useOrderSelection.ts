import { useCallback, useEffect, useState } from 'react';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderField, OrderSelectionFields } from 'types/orders.types';

// Derive the field keys from the OrderSelectionFields type

// Create a const object with the same keys for usage in components
export const OrderFieldKeys: { [K in OrderField]: K } = {
  drinkType: 'drinkType',
  drinkSubtype: 'drinkSubtype',
  volume: 'volume',
  containerType: 'containerType',
  initialTemperature: 'initialTemperature',
  finalTemperature: 'finalTemperature',
} as const;

interface UseOrderSelectionProps<T> {
  field: OrderField;
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

  const isValid: boolean = Object.keys(orders[0] || {}).length > 0 ? Boolean(field in orders[0]) : false;

  log('__DEV: isValid', 'hotpink', { TEST: orders[0], initialValue, isValid });

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
