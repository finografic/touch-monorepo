import type { FC } from 'react';
import { Suspense, useEffect, useMemo } from 'react';
import { setConfiguration } from 'react-grid-system';
import { Outlet, useLocation  } from 'react-router-dom';

import { AdminNavigation } from 'admin/components/AdminNavigation';
import { AdminErrorBoundary } from 'components/ErrorBoundary/AdminErrorBoundary';
import { Footer } from 'components/Footer/Footer';
import { Header } from 'components/Header/Header';
import { Loader } from 'components/Loader/Loader';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { UserToolbar } from 'components/Toolbars/UserToolbar/UserToolbar';

import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import { ContentProvider } from 'providers/ContentProvider';
import { getPathnameClassName } from 'routes/utils/routes.utils';

import { DevProvider } from 'dev-tools/providers/DevProvider/DevProvider';
import { BREAKPOINT_VALUES } from 'styles/viewport/viewport.breakpoints';
import { styles } from './AdminLayout.styles';

export const AdminLayout: FC = () => {
  const { theme } = useAppConfig();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const dataPathname = useMemo(() => getPathnameClassName(location), [location.pathname, isAuthenticated]);

  setConfiguration({ breakpoints: [...BREAKPOINT_VALUES] });

  useEffect(function initializeLayoutTheme() {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <AdminProvider>
      <ContentProvider>
        <DevProvider>
          <div
            id="admin-layout"
            data-pathname={dataPathname}
            data-authenticated={isAuthenticated}
            css={styles}
          >
            <Header titleAlign="left" toolbarAlign="right" toolbar={<UserToolbar variant="dark" />} />
            <AdminNavigation />
            <main id="layout-main">
              <div className="main-content">
                <section>
                  <PageHeader />
                  <div className="page-content" role="main">
                    <AdminErrorBoundary>
                      <Suspense fallback={<Loader message="Loading..." />}>
                        <Outlet />
                      </Suspense>
                    </AdminErrorBoundary>
                  </div>
                </section>
              </div>
            </main>
            <Footer />
            <nav className="page-navigation">{/* optional navigation */}</nav>
          </div>
        </DevProvider>
      </ContentProvider>
    </AdminProvider>
  );
};
