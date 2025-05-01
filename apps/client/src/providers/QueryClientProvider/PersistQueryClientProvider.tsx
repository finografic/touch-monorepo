import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { HydrateLoader } from 'routes/components/HydrateLoader';
// import { QueryDevtoolsPanel } from './QueryDevtoolsPanel';

interface Props {
  children: React.ReactNode;
}

export default function ({ children }: Props) {
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
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        // Optional: Handle successful hydration
        log('Query cache hydrated!', 'grey');
      }}
    >
      {children}
      {/* Show loading state while hydrating */}
      <HydrateLoader />
    </PersistQueryClientProvider>
  );
}
