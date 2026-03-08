import type { FC } from 'react';
import { Suspense, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';

import { Footer } from 'components/Footer';
import { FrontEndNavigation } from 'components/FrontEndNavigation/FrontEndNavigation';
import { Header } from 'components/Header/Header';
import { PageHeader } from 'components/PageHeader';
import { UserToolbar } from 'components/Toolbars';

import { useIsTouch } from 'hooks/useIsTouch';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { useAppConfig } from 'providers/AppConfigProvider';
import { ContentProvider } from 'providers/ContentProvider';
import { FiltersProvider } from 'providers/FiltersProvider';
import { LayoutUiProvider } from 'providers/LayoutUiProvider/LayoutUiProvider';
import { OrdersProvider } from 'providers/OrdersProvider/OrdersProvider';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { getPathnameClassName } from 'routes/utils/routes.utils';

import { DevProvider } from 'dev-tools/providers/DevProvider/DevProvider';
import { Loader } from '../components/Loader/Loader';
import { styles } from './Layout.styles';

export const Layout: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isTouch = useIsTouch();
  const dataPathname = useMemo(() => getPathnameClassName(location), [location.pathname]);

  const { theme } = useAppConfig();

  useEffect(function initializeLayoutTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-layout', 'front');
  }, []);

  useEffect(function cleanupLayoutAttr() {
    return () => document.documentElement.removeAttribute('data-layout');
  }, []);

  return (
    <OrdersProvider>
      <FiltersProvider>
        <PaginationProvider>
          <LayoutUiProvider>
            <AdminProvider>
              <ContentProvider>
                <DevProvider>
                  <div
                    id="layout"
                    data-pathname={dataPathname}
                    data-touch={isTouch}
                    css={styles}
                  >
                    <Header titleAlign="center" toolbarAlign="right" toolbar={<UserToolbar />} />
                    <main>
                      <div className="main-content">
                        <section>
                          {/* <PageHeader /> */}
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
                    <div id="radix-portal-container" />
                  </div>
                </DevProvider>
              </ContentProvider>
            </AdminProvider>
          </LayoutUiProvider>
        </PaginationProvider>
      </FiltersProvider>
    </OrdersProvider>
  );
};
