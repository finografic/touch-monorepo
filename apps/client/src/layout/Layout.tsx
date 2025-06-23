import { Suspense, useEffect } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { PageHeader } from 'components/PageHeader';
import { Navigation } from 'components/Navigation/Navigation';
import { ContentProvider } from 'providers/ContentProvider';
import { styles } from './Layout.styles';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { useIsMounted } from 'hooks/useIsMounted';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { Loader } from '../components/Loader/Loader';
import { DevProvider } from 'providers/DevProvider/DevProvider';
import { LayoutUiProvider } from 'providers/LayoutUiProvider/LayoutUiProvider';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { SessionProvider } from 'providers/SessionProvider/SessionProvider';

export const Layout: FC = () => {
  const { t } = useTranslation();
  const isMounted: boolean = !!useIsMounted();
  const location = useLocation();
  const navigate = useNavigate();

  // TODO: Browser refresh redirect - disabled for now since sessionStorage needs to persist
  // useEffect(() => {
  //   // Redirect logic would go here
  // }, [location.pathname, navigate]);

  if (!isMounted) {
    return <Loader message={t('ui.states.loading')} />;
  }

  return (
    <SessionProvider>
      <OrdersProvider>
        <PaginationProvider>
          <LayoutUiProvider>
            <ContentProvider>
              <AdminProvider>
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
                            <Navigation />
                          </nav>
                        </section>
                      </div>
                    </main>
                    <Footer />
                  </div>
                </DevProvider>
              </AdminProvider>
            </ContentProvider>
          </LayoutUiProvider>
        </PaginationProvider>
      </OrdersProvider>
    </SessionProvider>
  );
};
