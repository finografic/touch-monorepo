import { Suspense, useEffect } from 'react';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setConfiguration } from 'react-grid-system';
import { Theme } from '@radix-ui/themes';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { PageHeader } from 'components/PageHeader';
import { FrontEndNavigation } from 'components/FrontEndNavigation/FrontEndNavigation';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { FiltersProvider } from 'providers/FiltersProvider';
import { Loader } from '../components/Loader/Loader';
import { DevProvider } from 'dev-tools/providers/DevProvider/DevProvider';
import { LayoutUiProvider } from 'providers/LayoutUiProvider/LayoutUiProvider';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { TimersProvider } from 'providers/TimersProvider';
import { ContentProvider } from 'providers/ContentProvider';
import { useAppConfig } from 'providers/AppConfigProvider';
import { BREAKPOINT_VALUES } from 'styles/viewport/viewport.breakpoints';
import { useGetSlotConfigurations } from 'queries/slot-configurations/useGetSlotConfigurations';
import { NUM_GRID_ITEMS } from 'config/app';
import type { ValidGridSize } from 'types/menu.types';
import { ToastProvider } from 'components/Toast';
import { UserToolbar } from 'components/Toolbars';
import { styles } from './Layout.styles';
import { AuthDialogGuard } from 'components/Dialog/dialogs';

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
