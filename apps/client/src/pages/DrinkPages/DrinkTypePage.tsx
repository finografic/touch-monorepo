import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { stylesItemsGrid } from './items-grid.styles';
import { useEffect, useState } from 'react';
import type { DrinkType } from 'types/drinks.types';

const DRINK_TYPES = [
  {
    id: 'vino',
    name: 'Vino',
    display_name: 'Vino',
    has_subtypes: 0,
    default_consumption_time: 0,
    default_freeze_temp: 0,
    is_active: 1,
  },
  {
    id: 'licor',
    name: 'Licor',
    display_name: 'Licor',
    has_subtypes: 0,
    default_consumption_time: 0,
    default_freeze_temp: 0,
    is_active: 1,
  },
  {
    id: 'cava',
    name: 'Cava',
    display_name: 'Cava',
    has_subtypes: 0,
    default_consumption_time: 0,
    default_freeze_temp: 0,
    is_active: 1,
  },
  {
    id: 'zumo',
    name: 'Zumo',
    display_name: 'Zumo',
    has_subtypes: 0,
    default_consumption_time: 0,
    default_freeze_temp: 0,
    is_active: 1,
  },
  {
    id: 'cerveza',
    name: 'Cerveza',
    display_name: 'Cerveza',
    has_subtypes: 0,
    default_consumption_time: 0,
    default_freeze_temp: 0,
    is_active: 1,
  },
  {
    id: 'agua',
    name: 'Agua',
    display_name: 'Agua',
    has_subtypes: 0,
    default_consumption_time: 0,
    default_freeze_temp: 0,
    is_active: 1,
  },
  {
    id: 'refresco',
    name: 'Refresco',
    display_name: 'Refresco',
    has_subtypes: 0,
    default_consumption_time: 0,
    default_freeze_temp: 0,
    is_active: 1,
  },
] as const;

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
