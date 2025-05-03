import { stylesItemsGrid } from './grid.styles';
import type { DrinkType } from 'types/models/drink-type.model';
import { useOrderSelection } from 'hooks/useOrderSelection';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useEffect, useState } from 'react';
import { getGridFlowClasses } from './utils/getGridFlowClasses';
// import { ErrorMessage } from 'components/ErrorMessage/ErrorMessage';
// import { Loader } from 'components/Loader/Loader';
// import { useLoaderData, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { PATHS } from 'routes/routes.config';
import { NoItems } from 'components/NoItems/NoItems';
import { useOrders } from 'providers/OrdersProvider/OrdersContext';
import { OrderFieldKeys } from 'src/config/app.config';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useLayoutUi } from 'providers/LayoutUiProvider';
import type { PadItem } from 'types/ui.types';
import { usePadSelection } from 'hooks/usePadSelection';

export const DrinkTypePage = () => {
  const { fieldKey, loaderData: drinkTypes } = useRouteConfig();
  const { pads } = useLayoutUi();
  const { orders } = useOrders();
  const field = OrderFieldKeys.drinkType;
  const initialValue = orders[0]?.[field];
  const isValid = Boolean(initialValue !== null && initialValue !== undefined);

  const {
    selectedValue: selectedDrinkType,
    handleSelection: handleDrinkTypeSelection,
    hasValidSelection,
  } = usePadSelection<DrinkType>({ field, initialValue });

  // const { setIsNextDisabled } = usePagination();
  // const drinkTypes = useLoaderData() as DrinkType[];

  console.log('%c __USE_ROUTE:', 'color:lime', { pads });

  // const drinkTypes = useRouteLoaderData(PATHS.drinkType) as DrinkType[] | undefined;
  // const drinkTypes = useLoaderData() as DrinkType[] | undefined;

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

  if (!pads?.length) {
    return <NoItems message="No drink types found" />;
  }

  return (
    <>
      {/* <DevTools /> */}
      <section css={stylesItemsGrid}>
        <div className={getGridFlowClasses(pads.length)}>
          {pads.map((pad: PadItem) => (
            <div
              key={pad.key}
              className={`item-button ${selectedDrinkType?.id === pad.id ? 'selected' : ''}`}
              onClick={() => handleDrinkTypeSelection({ pad, fieldKey })}
            >
              {pad.label}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
