import { useState, useCallback, useEffect } from 'react';
import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';

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
  isValidSelection: (value: T | undefined) => boolean;
}

export function useOrderSelection<T>({ field, isValidSelection }: UseOrderSelectionOptions<T>) {
  const { orders, setOrders } = useOrders();
  const { setIsNextDisabled } = usePagination();
  const [selectedValue, setSelectedValue] = useState<T | null>(() => {
    // Initialize from first order's value if it exists
    const firstOrder = orders[0];
    return firstOrder && firstOrder[field] ? (firstOrder[field] as T) : null;
  });

  // Update next button disabled state whenever selection changes
  useEffect(() => {
    setIsNextDisabled(!isValidSelection(selectedValue || undefined));
  }, [selectedValue, setIsNextDisabled, isValidSelection]);

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
  };
}
