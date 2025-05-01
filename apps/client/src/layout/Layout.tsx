import type { FC } from 'react';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { DevDialog } from 'components/DevDialog/DevDialog';
import { PageContentProvider } from 'providers/PageContentProvider/PageContentProvider';
import { styles } from './Layout.styles';
import { DevTools } from 'components/DevTools/DevTools';
import { Suspense } from 'react';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { useIsMounted } from 'hooks/useIsMounted';
import { Outlet, useRouteLoaderData } from 'react-router-dom';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { Loader } from '../components/Loader/Loader';
import type { DrinkType } from 'types/models/drink-type.model';
import { NUM_SLOTS_TYPE_B, OrderFieldKeys } from 'constants/app.config';
import { LayoutUiProvider } from 'providers/LayoutUiProvider/LayoutUiProvider';
import { initPadItems } from 'utils/ui.utils';
import type { LayoutUiValues } from 'providers/LayoutUiProvider/LayoutUiContext.types';

export const Layout: FC = () => {
  const isMounted: boolean = !!useIsMounted();
  const drinkTypes = useRouteLoaderData(OrderFieldKeys.drinkType) as DrinkType[] | undefined;

  const initialValue: LayoutUiValues = {
    fieldKey: drinkTypes ? OrderFieldKeys.drinkType : undefined,
    numSlots: NUM_SLOTS_TYPE_B,
    numPads: drinkTypes ? drinkTypes.length : 0,
    pads: initPadItems({ numPads: drinkTypes ? drinkTypes.length : 0, keys: [], type: 'radio' }),
  };

  if (!isMounted) {
    return <Loader message="Loading..." />;
  }

  return (
    <OrdersProvider>
      <PaginationProvider>
        <LayoutUiProvider initialValue={initialValue}>
          <PageContentProvider>
            <div id="layout" css={styles}>
              <Header />
              <main>
                <div className="main-content">
                  <Suspense fallback={<Loader message="Loading..." />}>
                    <Outlet />
                    <DevDialog />
                  </Suspense>
                  <DevTools />
                </div>
              </main>
              <Footer />
            </div>
          </PageContentProvider>
        </LayoutUiProvider>
      </PaginationProvider>
    </OrdersProvider>
  );
};
