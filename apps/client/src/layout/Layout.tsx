import { Suspense } from 'react';
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
import { ToastProvider, ToastSystem } from 'components/Toast';
import { UserToolbar } from 'components/Toolbars';
import { styles } from './Layout.styles';
import { useResetAppState } from 'hooks/useResetAppState';
import { AuthLoginDialog } from 'components/Dialog/dialogs';

export const Layout: FC = () => {
  const { t } = useTranslation();
  const { theme } = useAppConfig();
  const { data: slotConfigs } = useGetSlotConfigurations();
  const numItems = (slotConfigs ? slotConfigs.length : NUM_GRID_ITEMS) as ValidGridSize;

  setConfiguration({ breakpoints: [...BREAKPOINT_VALUES] });

  // Main theme configuration - uses current theme from AppConfig
  const mainTheme = {
    appearance: theme as 'light' | 'dark',
    grayColor: 'slate' as const,
    accentColor: 'blue' as const,
    scaling: '100%' as const,
  };

  return (
    <ToastProvider>
      <TimersProvider>
        <OrdersProvider>
          <FiltersProvider>
            <PaginationProvider>
              <LayoutUiProvider initialValue={{ numItems }}>
                <AdminProvider>
                  <ContentProvider>
                    <DevProvider>
                      <Theme
                        appearance={mainTheme.appearance}
                        grayColor={mainTheme.grayColor}
                        accentColor={mainTheme.accentColor}
                        scaling={mainTheme.scaling}
                      >
                        <div id="layout" css={styles}>
                          {/** Use a child component to access reset hook inside providers */}
                          <HeaderWithToolbar />
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
                          <AuthLoginDialog />
                          <Footer />
                          <div id="radix-portal-container" />
                        </div>
                        <ToastSystem />
                      </Theme>
                    </DevProvider>
                  </ContentProvider>
                </AdminProvider>
              </LayoutUiProvider>
            </PaginationProvider>
          </FiltersProvider>
        </OrdersProvider>
      </TimersProvider>
    </ToastProvider>
  );
};

// Child component rendered within providers so context hooks are valid
function HeaderWithToolbar() {
  const { resetAppState } = useResetAppState();
  return <Header titleAlign="center" toolbarAlign="right" toolbar={<UserToolbar />} />;
}
