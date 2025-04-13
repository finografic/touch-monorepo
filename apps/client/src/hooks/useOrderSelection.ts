import { useState, useCallback } from 'react';
import { useOrders } from 'providers/OrdersProvider';
import type { OrderSelectionFields } from 'types/orders.types';

// Derive the field keys from the OrderSelectionFields type
export type OrderField = keyof OrderSelectionFields;

// Create a const object with the same keys for usage in components
export const OrderFieldKeys: { [K in OrderField]: K } = {
  drinkType: 'drinkType',
  drinkSubtype: 'drinkSubtype',
  volume: 'volume',
  finalTemperature: 'finalTemperature',
  containerType: 'containerType',
  initialTemperature: 'initialTemperature',
} as const;

export function useOrderSelection<T>({ field }: { field: OrderField }) {
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
