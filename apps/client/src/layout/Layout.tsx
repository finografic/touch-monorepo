import { Suspense } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { PageHeader } from 'components/PageHeader';
import { Navigation } from 'components/Navigation/Navigation';
import { styles } from './Layout.styles';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { useIsMounted } from 'hooks/useIsMounted';
import { Outlet } from 'react-router-dom';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { Loader } from '../components/Loader/Loader';
import { DevProvider } from 'dev-tools/providers/DevProvider/DevProvider';
import { LayoutUiProvider } from 'providers/LayoutUiProvider/LayoutUiProvider';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { SessionProvider } from 'providers/SessionProvider/SessionProvider';
import { TimersProvider } from 'providers/TimersProvider';
import { BREAKPOINT_VALUES } from 'styles/viewport/viewport.breakpoints';
import { setConfiguration } from 'react-grid-system';
import { DevGuidesLayer } from 'dev-tools/DevGuidesLayer/DevGuidesLayer';

export const Layout: FC = () => {
  const { t } = useTranslation();
  const isMounted: boolean = !!useIsMounted();
  // const location = useLocation();
  // const navigate = useNavigate();

  setConfiguration({ breakpoints: [...BREAKPOINT_VALUES] });

  // TODO: Browser refresh redirect - disabled for now since sessionStorage needs to persist
  // useEffect(() => {
  //   // Redirect logic would go here
  // }, [location.pathname, navigate]);

  if (!isMounted) {
    return <Loader message={t('ui.states.loading')} />;
  }

  return (
    <SessionProvider>
      <TimersProvider>
        <OrdersProvider>
          <PaginationProvider>
            <LayoutUiProvider>
              <AdminProvider>
                <DevProvider>
                  <DevGuidesLayer>
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
                  </DevGuidesLayer>
                </DevProvider>
              </AdminProvider>
            </LayoutUiProvider>
          </PaginationProvider>
        </OrdersProvider>
      </TimersProvider>
    </SessionProvider>
  );
};
