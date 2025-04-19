import { stylesItemsGrid } from './items-grid.styles';
import type { DrinkType } from '@touch/shared/types';
import { useOrderSelection, OrderFieldKeys } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { useGetDrinkTypes } from 'queries/drink-types';

export const DrinkTypePage = () => {
  const {
    selectedValue: selectedType,
    handleSelection: handleTypeSelection,
    hasValidSelection,
  } = useOrderSelection<DrinkType>({
    field: OrderFieldKeys.drinkType,
  });

  const { setIsNextDisabled } = usePagination();
  const { data: drinkTypes, isLoading, error } = useGetDrinkTypes();

  // Update next button state based on selection
  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  if (isLoading) {
    return <div>Loading drink types...</div>;
  }

  if (error) {
    return <div>Error loading drink types</div>;
  }

  if (!drinkTypes?.length) {
    return <div>No drink types available</div>;
  }

  return (
    <section css={stylesItemsGrid}>
      <div className={getGridFlowClasses(drinkTypes.length)}>
        {drinkTypes.map((drinkType: DrinkType) => (
          <div
            key={drinkType.id}
            className={`item-button ${selectedType?.id === drinkType.id ? 'selected' : ''}`}
            onClick={() => handleTypeSelection(drinkType)}
          >
            {drinkType.displayName}
          </div>
        ))}
      </div>
    </section>
  );
};
