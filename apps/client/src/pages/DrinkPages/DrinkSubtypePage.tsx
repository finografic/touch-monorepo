import { stylesItemsGrid } from './grid.styles';
import type { DrinkSubtype } from 'types/models/drink-type.model';
import { OrderFieldKeys, useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { useGetDrinkSubtypes } from 'queries/drink-types/useGetDrinkSubtypes';
import { ErrorMessage } from 'components/ErrorMessage/ErrorMessage';
import { Loader } from 'components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'routes/routes.config';

export const DrinkSubtypePage = () => {
  const navigate = useNavigate();
  const {
    selectedValue: selectedDrinkSubtype,
    handleSelection: handleDrinkSubtypeSelection,
    hasValidSelection,
    orders,
  } = useOrderSelection<DrinkSubtype>({
    field: OrderFieldKeys.drinkSubtype,
  });

  const { setIsNextDisabled } = usePagination();
  const { data, isLoading, error } = useGetDrinkSubtypes(orders[0]?.drinkType?.id);

  useEffect(() => {
    // If the selected drink type doesn't have subtypes, skip this page
    if (orders[0]?.drinkType && !orders[0].drinkType.hasSubtypes) {
      navigate(ROUTES.DRINK_VOLUME);
    }
  }, [orders, navigate]);

  useEffect(() => {
    setIsNextDisabled(!hasValidSelection);
  }, [hasValidSelection, setIsNextDisabled]);

  if (isLoading) {
    return <Loader message="Loading drink subtypes..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <section css={stylesItemsGrid}>
      {data?.length ? (
        <div className={getGridFlowClasses(data.length)}>
          {data.map((subtype: DrinkSubtype) => (
            <div
              key={subtype.id}
              className={`item-button ${selectedDrinkSubtype?.id === subtype.id ? 'selected' : ''}`}
              onClick={() => handleDrinkSubtypeSelection(subtype)}
            >
              {subtype.displayName}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: 'orange' }}>No subtypes available for this drink type</div>
      )}
    </section>
  );
};
