import { stylesItemsGrid } from './items-grid.styles';
import type { DrinkType } from 'types/drinks.types';
import { DRINK_TYPES } from './drink-type.data';
import { useOrderSelection, OrderFieldKeys } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';

export const DrinkTypePage = () => {
  const {
    selectedValue: selectedType,
    handleSelection: handleTypeSelection,
    hasValidSelection,
  } = useOrderSelection<DrinkType>({
    field: OrderFieldKeys.drinkType,
  });

  const { setIsNextDisabled } = usePagination();

  // Update next button state based on selection
  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  return (
    <section css={stylesItemsGrid}>
      <div className={getGridFlowClasses(DRINK_TYPES.length)}>
        {DRINK_TYPES.map((drinkType) => (
          <div
            key={drinkType.id}
            className={`item-button ${selectedType?.id === drinkType.id ? 'selected' : ''}`}
            onClick={() => handleTypeSelection(drinkType)}
          >
            {drinkType.display_name}
          </div>
        ))}
      </div>
    </section>
  );
};
