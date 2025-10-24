import type { FC } from 'react';
import { Suspense, useEffect } from 'react';
import { setConfiguration } from 'react-grid-system';
import { Outlet } from 'react-router-dom';

import { AdminNavigation } from 'admin/components/AdminNavigation';
import { AdminErrorBoundary } from 'components/ErrorBoundary/AdminErrorBoundary';
import { Footer } from 'components/Footer/Footer';
import { Header } from 'components/Header/Header';
import { Loader } from 'components/Loader/Loader';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { ToastSystem } from 'components/Toast';
import { UserToolbar } from 'components/Toolbars/UserToolbar/UserToolbar';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { useAppConfig } from 'providers/AppConfigProvider';
import { ContentProvider } from 'providers/ContentProvider';

import { DevProvider } from 'dev-tools/providers/DevProvider/DevProvider';
import { BREAKPOINT_VALUES } from 'styles/viewport/viewport.breakpoints';
import { styles } from './AdminLayout.styles';

export const AdminLayout: FC = () => {
  const { theme } = useAppConfig();
  setConfiguration({ breakpoints: [...BREAKPOINT_VALUES] });

  useEffect(function initializeLayoutTheme() {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <AdminProvider>
      <ContentProvider>
        <DevProvider>
          <div id="admin-layout" css={styles}>
            <Header titleAlign="left" toolbarAlign="right" toolbar={<UserToolbar />} />
            <AdminNavigation />
            <main>
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
                  <nav className="page-navigation">{/* optional navigation */}</nav>
                </section>
              </div>
            </main>
            <Footer />
            <ToastSystem />
          </div>
        </DevProvider>
      </ContentProvider>
    </AdminProvider>
  );
};
