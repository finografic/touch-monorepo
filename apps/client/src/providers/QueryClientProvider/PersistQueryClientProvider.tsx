import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryDevtoolsPanel } from './QueryDevtoolsPanel';

export default function ({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: 5 * 60 * 1000, // 5 minutes
        // gcTime: 10 * 60 * 1000, // 10 minutes - ALREADY DEFAULT
        // gcTime: 1000 * 60 * 60 * 24, // 24 hours
        retry: 3, // NOTE: default is 3
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // TESTING FROM TANSTACK DOCS...
        refetchOnMount: true,
        refetchOnWindowFocus: false,
      },
    },
  });

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen /> */}
      <QueryDevtoolsPanel />
    </PersistQueryClientProvider>
  );
}
