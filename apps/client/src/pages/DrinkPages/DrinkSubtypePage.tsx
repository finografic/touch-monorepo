import { stylesItemsGrid } from './grid.styles';
import type { DrinkSubtype } from 'types/models/drink-type.model';
import { useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
import { useGetDrinkSubtypes } from 'queries/drink-types/useGetDrinkSubtypes';
import { ErrorMessage } from 'components/ErrorMessage/ErrorMessage';
import { Loader } from 'components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'routes/routes.config';
import { usePageContent } from 'providers/PageContentProvider/PageContentContext';
import { NoItems } from 'components/NoItems/NoItems';
import { OrderFieldKeys } from 'constants/app.config';

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

  const drinkTypeId = orders[0]?.drinkType?.id as string;
  const hasSubtypes = !!orders[0]?.drinkType?.hasSubtypes;

  const { setIsNextDisabled } = usePagination();
  const { setPageContentTitle } = usePageContent();
  const { data, isLoading, error } = useGetDrinkSubtypes({
    drinkTypeId,
    enabled: !!(drinkTypeId && hasSubtypes),
  });

  useEffect(() => {
    if (hasSubtypes) {
      const drinkTypeName = orders[0]?.drinkType?.displayName;
      const newTitle = drinkTypeName
        ? `Select type of ${drinkTypeName.toLowerCase()}:`
        : 'Select drink subtype:';
      setPageContentTitle(newTitle);
    } else {
      navigate(ROUTES.DRINK_TYPE, { replace: true });
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
        <NoItems message="No subtypes available for this drink type" />
      )}
    </section>
  );
};
