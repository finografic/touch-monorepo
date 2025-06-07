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
        retry: false, // Disable retries for local development
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
