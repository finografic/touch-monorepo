import type { FC } from 'react';
import { Suspense, useEffect } from 'react';
import { setConfiguration } from 'react-grid-system';
import { Outlet } from 'react-router-dom';

import { Theme } from '@radix-ui/themes';
import { AdminNavigation } from 'admin/components/AdminNavigation';

import { AuthDialogGuard } from 'components/Dialog/dialogs';
import { AdminErrorBoundary } from 'components/ErrorBoundary/AdminErrorBoundary';
import { Footer } from 'components/Footer/Footer';
import { Header } from 'components/Header/Header';
import { Loader } from 'components/Loader/Loader';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { ToastProvider, ToastSystem } from 'components/Toast';
import { UserToolbar } from 'components/Toolbars/UserToolbar/UserToolbar';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { ContentProvider } from 'providers/ContentProvider';

import { DevProvider } from 'dev-tools/providers/DevProvider/DevProvider';

import { BREAKPOINT_VALUES } from 'styles/viewport/viewport.breakpoints';
import { styles } from './AdminLayout.styles';

export const AdminLayout: FC = () => {
  setConfiguration({ breakpoints: [...BREAKPOINT_VALUES] });

  useEffect(function initializeLayoutTheme() {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const themeConfig = {
    grayColor: 'slate' as const,
    accentColor: 'blue' as const,
    scaling: '100%' as const,
  };

  return (
    <Theme {...themeConfig}>
      <ToastProvider>
        <AdminProvider>
          <ContentProvider>
            <DevProvider>
              <div id="admin-layout" css={styles}>
                <AuthDialogGuard>
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
                        <nav className="page-navigation">{/* Page navigation can go here if needed */}</nav>
                      </section>
                    </div>
                  </main>
                  <Footer />
                </AuthDialogGuard>
                <ToastSystem />
              </div>
            </DevProvider>
          </ContentProvider>
        </AdminProvider>
      </ToastProvider>
    </Theme>
  );
};
