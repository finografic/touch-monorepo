import { Suspense } from 'react';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setConfiguration } from 'react-grid-system';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { PageHeader } from 'components/PageHeader';
import { FrontEndNavigation } from 'components/FrontEndNavigation/FrontEndNavigation';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { Loader } from '../components/Loader/Loader';
import { DevProvider } from 'dev-tools/providers/DevProvider/DevProvider';
import { LayoutUiProvider } from 'providers/LayoutUiProvider/LayoutUiProvider';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { TimersProvider } from 'providers/TimersProvider';
import { ContentProvider } from 'providers/ContentProvider';
import { BREAKPOINT_VALUES } from 'styles/viewport/viewport.breakpoints';
import { styles } from './Layout.styles';
import { useGetSlotConfigurations } from 'queries/slot-configurations/useGetSlotConfigurations';
import { NUM_GRID_ITEMS } from 'constants/app.config';
import type { ValidGridSize } from 'types/menu.types';

export const Layout: FC = () => {
  const { t } = useTranslation();
  const { data: slotConfigs } = useGetSlotConfigurations();
  const numItems = (slotConfigs ? slotConfigs.length : NUM_GRID_ITEMS) as ValidGridSize;

  setConfiguration({ breakpoints: [...BREAKPOINT_VALUES] });

  return (
    <TimersProvider>
      <OrdersProvider>
        <PaginationProvider>
          <LayoutUiProvider initialValue={{ numItems }}>
            <AdminProvider>
              <ContentProvider>
                <DevProvider>
                  <div id="layout" css={styles}>
                    <Header />
                    <main>
                      <div className="main-content">
                        <section>
                          <PageHeader />
                          <div className="page-content" role="main">
                            <Suspense fallback={<Loader message={t('ui.states.loading')} />}>
                              <Outlet />
                            </Suspense>
                          </div>
                          <nav className="page-navigation">
                            <FrontEndNavigation />
                          </nav>
                        </section>
                      </div>
                    </main>
                    <Footer />
                  </div>
                </DevProvider>
              </ContentProvider>
            </AdminProvider>
          </LayoutUiProvider>
        </PaginationProvider>
      </OrdersProvider>
    </TimersProvider>
  );
};
