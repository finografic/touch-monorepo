import { stylesItemsGrid } from './grid.styles';
import type { DrinkType } from 'types/models/drink-type.model';
import { useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect, useState } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
// import { ErrorMessage } from 'components/ErrorMessage/ErrorMessage';
// import { Loader } from 'components/Loader/Loader';
import { useLoaderData, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { PATHS } from 'routes/routes.config';
import { NoItems } from 'components/NoItems/NoItems';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { OrderFieldKeys } from 'constants/app.config';
import { DevTools } from 'components/DevTools/DevTools';

export const DrinkTypePage = () => {
  // const navigate = useNavigate();
  // const [nextClicked, setNextClicked] = useState(false);
  const { orders } = useOrders();
  const field = OrderFieldKeys.drinkType;
  const initialValue = orders[0]?.[field];
  const isValid = Boolean(initialValue !== null && initialValue !== undefined);

  const {
    selectedValue: selectedDrinkType,
    handleSelection: handleDrinkTypeSelection,
    hasValidSelection,
  } = useOrderSelection<DrinkType>({ field, initialValue });

  const { setIsNextDisabled } = usePagination();
  // const drinkTypes = useLoaderData() as DrinkType[];

  // const drinkTypes = useRouteLoaderData(PATHS.drinkType) as DrinkType[] | undefined;
  const drinkTypes = useLoaderData() as DrinkType[] | undefined;

  // console.log('%c __DRINK', 'color:orange', { drinkTypes });

  // log('__DEV: isValid', 'blue', { isValid });

  // useEffect(() => {
  //   log('__DEV: DrinkTypePage', 'blue', drinkTypes);
  // }, [drinkTypes]);

  // if (isLoading) {
  //   return <Loader message="Loading drink types..." />;
  // }

  // if (error) {
  //   return <ErrorMessage error={error} />;
  // }

  if (!drinkTypes?.length) {
    return <NoItems message="No drink types found" />;
  }

  return (
    <>
      {/* <DevTools /> */}
      <section css={stylesItemsGrid}>
        <div className={getGridFlowClasses(drinkTypes.length)}>
          {drinkTypes.map((drinkType: DrinkType) => (
            <div
              key={drinkType.id}
              className={`item-button ${selectedDrinkType?.id === drinkType.id ? 'selected' : ''}`}
              onClick={() => handleDrinkTypeSelection(drinkType)}
            >
              {drinkType.displayName}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
