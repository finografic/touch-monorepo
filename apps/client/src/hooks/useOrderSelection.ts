import { useCallback, useState, useEffect } from 'react';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderSelectionFields } from 'types/orders.types';
import { useOutletContext } from 'react-router-dom';

// Derive the field keys from the OrderSelectionFields type
export type OrderField = keyof OrderSelectionFields;

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
  const isMounted = !!useOutletContext<{ isMounted: boolean }>()?.isMounted;
  const { orders, setOrders } = useOrders();
  const [selectedValue, setSelectedValue] = useState<T | null>((orders[0] as T) || (initialValue as T));

  useEffect(() => {
    if (isMounted && orders.length && initialValue) {
      const updatedOrders = orders.map((order) => ({ ...order, [field]: initialValue }));
      setOrders(updatedOrders);
    }
  }, [initialValue, isMounted, orders, setOrders]);

  const handleSelection = useCallback(
    (newValue: T | undefined) => {
      if (!isMounted) return;

      const valueToSet = selectedValue && newValue === selectedValue ? null : newValue || null;
      const updatedOrders = orders.map((order) => ({ ...order, [field]: valueToSet }));
      setOrders(updatedOrders);
      setSelectedValue(valueToSet);
    },
    [field, orders, selectedValue, setOrders, isMounted],
  );

  return {
    selectedValue,
    handleSelection,
    orders,
    setOrders,
    hasValidSelection: selectedValue !== null,
  };
}
