import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { stylesItemsGrid } from './items-grid.styles';
import { useEffect, useState } from 'react';

const DRINK_TYPES = [
  { id: 'vino', name: 'Vino' },
  { id: 'licor', name: 'Licor' },
  { id: 'cava', name: 'Cava' },
  { id: 'zumo', name: 'Zumo' },
  { id: 'cerveza', name: 'Cerveza' },
  { id: 'agua', name: 'Agua' },
  { id: 'refresco', name: 'Refresco' },
] as const;

export const DrinkTypePage = () => {
  const { orders } = useOrders();
  const { setIsNextDisabled } = usePagination();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const {} = usePagination();

  const numSelected = Object.values(orders).filter((order) => !!order.drinkType).length;

  useEffect(() => {
    setIsNextDisabled(numSelected === 0);
  }, [numSelected, setIsNextDisabled]);

  return (
    <section css={stylesItemsGrid}>
      <div className="items-grid">
        {DRINK_TYPES.map(({ id, name }) => (
          <div
            key={id}
            className={`item-button ${id} ${selectedType === id ? 'selected' : ''}`}
            onClick={() => setSelectedType(selectedType === id ? null : id)}
          >
            {name}
          </div>
        ))}
      </div>
    </section>
  );
};
