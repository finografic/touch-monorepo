import type { FC } from 'react';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { DevDialog } from 'components/DevDialog/DevDialog';
import { PageContentProvider } from 'providers/PageContentProvider/PageContentProvider';
import { styles } from './Layout.styles';
import { DevTools } from 'components/DevTools/DevTools';
import { Suspense } from 'react';
import { PaginationProvider } from 'providers/PaginationProvider/PaginationProvider';
import { useIsMounted } from 'hooks/useIsMounted';
import { Outlet } from 'react-router-dom';

export const Layout: FC = () => {
  const isMounted = useIsMounted();

  return (
    <PaginationProvider>
      <PageContentProvider>
        <div id="layout" css={styles}>
          <Header />
          <Suspense fallback={<div>Loading...</div>}>
            <main>
              <div className="main-content">
                <Outlet context={{ isMounted }} />
              </div>
            </main>
            <Footer />
            <DevDialog />
          </Suspense>
        </div>
        <DevTools />
      </PageContentProvider>
    </PaginationProvider>
  );
};
