import type { FC } from 'react';
import { Suspense, useEffect } from 'react';
import { setConfiguration } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { Theme } from '@radix-ui/themes';

import { AuthDialogGuard } from 'components/Dialog/dialogs';
import { Footer } from 'components/Footer';
import { FrontEndNavigation } from 'components/FrontEndNavigation/FrontEndNavigation';
import { Header } from 'components/Header/Header';
import { PageHeader } from 'components/PageHeader';
import { ToastProvider } from 'components/Toast';
import { UserToolbar } from 'components/Toolbars';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { useAppConfig } from 'providers/AppConfigProvider';
import { ContentProvider } from 'providers/ContentProvider';
import { FiltersProvider } from 'providers/FiltersProvider';
import { LayoutUiProvider } from 'providers/LayoutUiProvider/LayoutUiProvider';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { TimersProvider } from 'providers/TimersProvider';

import { DevProvider } from 'dev-tools/providers/DevProvider/DevProvider';
import { useGetSlotConfigurations } from 'queries/slot-configurations/useGetSlotConfigurations';
import type { ValidGridSize } from 'types/menu.types';

import { NUM_GRID_ITEMS } from 'config/app';
import { Loader } from '../components/Loader/Loader';
import { BREAKPOINT_VALUES } from 'styles/viewport/viewport.breakpoints';
import { styles } from './Layout.styles';

export const Layout: FC = () => {
  const { t } = useTranslation();
  const { theme } = useAppConfig();
  const { data: slotConfigs } = useGetSlotConfigurations();
  const numItems = (slotConfigs ? slotConfigs.length : NUM_GRID_ITEMS) as ValidGridSize;

  setConfiguration({ breakpoints: [...BREAKPOINT_VALUES] });

  useEffect(function initializeLayoutTheme() {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const themeConfig = {
    appearance: theme,
    grayColor: 'slate' as const,
    accentColor: 'blue' as const,
    scaling: '100%' as const,
  };

  return (
    <Theme {...themeConfig}>
      <ToastProvider>
        <TimersProvider>
          <OrdersProvider>
            <FiltersProvider>
              <PaginationProvider>
                <LayoutUiProvider initialValue={{ numItems }}>
                  <AdminProvider>
                    <ContentProvider>
                      <DevProvider>
                        <div id="layout" css={styles}>
                          <AuthDialogGuard>
                            <Header titleAlign="center" toolbarAlign="right" toolbar={<UserToolbar />} />
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
                          </AuthDialogGuard>
                          <div id="radix-portal-container" />
                        </div>
                      </DevProvider>
                    </ContentProvider>
                  </AdminProvider>
                </LayoutUiProvider>
              </PaginationProvider>
            </FiltersProvider>
          </OrdersProvider>
        </TimersProvider>
      </ToastProvider>
    </Theme>
  );
};
