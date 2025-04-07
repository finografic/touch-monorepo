import { useOrders } from 'providers/OrdersProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { styles } from './DrinkTypePage.styles';
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
    <div css={styles}>
      <h2>Select drink type:</h2>
      <div className="selected-pads">Selected pads: {Object.keys(orders).join(', ')}</div>

      <div className="DRINK-grid">
        {DRINK_TYPES.map(({ id, name }) => (
          <div
            key={id}
            className={`drink-type ${id} ${selectedType === id ? 'selected' : ''}`}
            onClick={() => setSelectedType(id)}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};
