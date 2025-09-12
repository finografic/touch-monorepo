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
import { SessionProvider } from 'providers/SessionProvider/SessionProvider';
import { TimersProvider } from 'providers/TimersProvider';
import { ContentProvider } from 'providers/ContentProvider';
import { BREAKPOINT_VALUES } from 'styles/viewport/viewport.breakpoints';
import { styles } from './Layout.styles';

export const Layout: FC = () => {
  const { t } = useTranslation();

  setConfiguration({ breakpoints: [...BREAKPOINT_VALUES] });

  return (
    <SessionProvider>
      <TimersProvider>
        <OrdersProvider>
          <PaginationProvider>
            <LayoutUiProvider>
              <AdminProvider>
                <DevProvider>
                  <ContentProvider>
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
                  </ContentProvider>
                </DevProvider>
              </AdminProvider>
            </LayoutUiProvider>
          </PaginationProvider>
        </OrdersProvider>
      </TimersProvider>
    </SessionProvider>
  );
};
