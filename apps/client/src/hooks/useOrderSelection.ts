import { useState, useCallback } from 'react';
import { useOrders } from 'providers/OrdersProvider';

type OrderField = keyof typeof OrderFieldKeys;

// These keys should match both the database fields and the order context fields
export const OrderFieldKeys = {
  drinkType: 'drinkType',
  volume: 'volume',
  finalTemperature: 'finalTemperature',
  containerType: 'containerType',
  initialTemperature: 'initialTemperature',
} as const;

interface UseOrderSelectionOptions<T> {
  field: OrderField;
}

export function useOrderSelection<T>({ field }: UseOrderSelectionOptions<T>) {
  const { orders, setOrders } = useOrders();
  const [selectedValue, setSelectedValue] = useState<T | null>(() => {
    // Initialize from first order's value if it exists
    const firstOrder = orders[0];
    return firstOrder && firstOrder[field] ? (firstOrder[field] as T) : null;
  });

  const handleSelection = useCallback(
    (newValue: T | undefined) => {
      // If selecting the same value, clear it
      const valueToSet = selectedValue && newValue === selectedValue ? null : newValue || null;
      setSelectedValue(valueToSet);

      // Update all orders with the new value
      const updatedOrders = orders.map((order) => ({
        ...order,
        [field]: valueToSet,
      }));

      setOrders(updatedOrders);
    },
    [field, orders, selectedValue, setOrders],
  );

  return {
    selectedValue,
    handleSelection,
    // Expose these in case the component needs them directly
    orders,
    setOrders,
    // Helper to check if there's a valid selection
    hasValidSelection: selectedValue !== null,
  };
}
