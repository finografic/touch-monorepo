import { stylesItemsGrid } from './grid.styles';
import type { DrinkType } from 'types/models/drink-type.model';
import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect, useState } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { useGetDrinkTypes } from 'queries/drink-types/useGetDrinkTypes';
import { ErrorMessage } from 'components/ErrorMessage/ErrorMessage';
import { Loader } from 'components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'routes/routes.config';
import { NoItems } from 'components/NoItems/NoItems';

export const DrinkTypePage = () => {
  const navigate = useNavigate();
  const [nextClicked, setNextClicked] = useState(false);
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

  // Handle navigation on Next button click
  useEffect(() => {
    if (selectedDrinkType && nextClicked) {
      // Navigate to subtype page if the drink has subtypes, otherwise go to volume page
      const nextRoute = selectedDrinkType.hasSubtypes ? ROUTES.DRINK_SUBTYPE : ROUTES.DRINK_VOLUME;
      navigate(nextRoute);
    }
  }, [selectedDrinkType, nextClicked, navigate]);

  // Listen for next button clicks
  useEffect(() => {
    if (!setIsNextDisabled) {
      setNextClicked(true);
    }
  }, [setIsNextDisabled]);

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
        <NoItems message="No drink types available" />
      )}
    </section>
  );
};
