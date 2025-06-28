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
        retry: 3, // Enable retries for production reliability
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes default
        gcTime: 1000 * 60 * 30, // 30 minutes default
      },
    },
  });

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    // Don't persist admin queries - they should always refetch for fresh data
    serialize: (data) => {
      const filteredData = {
        ...data,
        clientState: {
          ...data.clientState,
          queries: data.clientState.queries.filter((query: any) => {
            const queryKey = query.queryKey;
            // Exclude admin-related and external API queries from persistence
            const isAdminQuery = queryKey.some(
              (key: string) =>
                typeof key === 'string' &&
                (key.includes('admin') ||
                  key.includes('supportedLanguages') ||
                  key.includes('Admin') ||
                  key.includes('countries')), // Exclude REST Countries API data
            );
            return !isAdminQuery;
          }),
        },
      };
      return JSON.stringify(filteredData);
    },
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        // Optional: Handle successful hydration
        console.log('%cQuery cache hydrated!', 'color:grey');
      }}
    >
      {children}
      {/* Show loading state while hydrating */}
      <HydrateLoader />
    </PersistQueryClientProvider>
  );
}
