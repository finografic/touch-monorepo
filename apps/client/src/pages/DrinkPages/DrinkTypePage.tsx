import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { stylesItemsGrid } from './items-grid.styles';
import { useEffect, useState } from 'react';
import type { DrinkType } from 'types/drinks.types';
import { DRINK_TYPES } from './drink-type.data';

export const DrinkTypePage = () => {
  const { orders, setOrders } = useOrders();
  const { setIsNextDisabled } = usePagination();
  const [selectedType, setSelectedType] = useState<DrinkType | null>(null);

  useEffect(() => {
    setIsNextDisabled(!selectedType);
  }, [selectedType, setIsNextDisabled]);

  const handleTypeSelection = (drinkType: DrinkType) => {
    const newType = selectedType?.id === drinkType.id ? undefined : drinkType;
    setSelectedType(newType || null);

    // Update all orders with the new drink type
    const updatedOrders = orders.map((order) => ({
      ...order,
      drinkType: newType,
    }));

    setOrders(updatedOrders);
  };

  return (
    <section css={stylesItemsGrid}>
      <div className="items-grid">
        {DRINK_TYPES.map((drinkType) => (
          <div
            key={drinkType.id}
            className={`item-button ${drinkType.id} ${selectedType?.id === drinkType.id ? 'selected' : ''}`}
            onClick={() => handleTypeSelection(drinkType)}
          >
            {drinkType.display_name}
          </div>
        ))}
      </div>
    </section>
  );
};
