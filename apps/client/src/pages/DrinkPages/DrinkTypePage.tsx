import { stylesItemsGrid } from './items-grid.styles';
import type { DrinkType } from '@touch/shared/types';
import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { useGetDrinkTypes } from 'queries/drink-types/useGetDrinkTypes';
import { ErrorMessage } from 'components/ErrorMessage/ErrorMessage';
import { Loader } from 'components/Loader/Loader';

export const DrinkTypePage = () => {
  const {
    selectedValue: selectedDrinkType,
    handleSelection: handleDrinkTypeSelection,
    hasValidSelection,
  } = useOrderSelection<DrinkType>({
    field: OrderFieldKeys.drinkType,
  });

  const { setIsNextDisabled } = usePagination();
  const { data, isLoading, error } = useGetDrinkTypes();

  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  if (isLoading) {
    return <Loader message="Loading drink types..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <section css={stylesItemsGrid}>
      {data?.length ? (
        <div className={getGridFlowClasses(data.length)}>
          {data.map((drinkType: DrinkType) => (
            <div
              key={drinkType.id}
              className={`item-button ${selectedDrinkType?.id === drinkType.id ? 'selected' : ''}`}
              onClick={() => handleDrinkTypeSelection(drinkType)}
            >
              {drinkType.displayName}
            </div>
          ))}
        </div>
      ) : (
        <div>No drink types available</div>
      )}
    </section>
  );
};
