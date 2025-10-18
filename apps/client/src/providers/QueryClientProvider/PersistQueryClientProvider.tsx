import React from 'react';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { HydrateLoader } from 'routes/components/HydrateLoader';
// import { QueryDevtoolsPanel } from './QueryDevtoolsPanel';

// Helper: Safe localStorage access
function isLocalStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Fallback in-memory persister
const memoryPersister = {
  persistClient: async () => {},
  restoreClient: async () => undefined,
  removeClient: async () => {},
};

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

  let persister: any = memoryPersister;
  let persistenceEnabled = false;

  // Try to use localStorage, fallback to memory if unavailable
  if (isLocalStorageAvailable()) {
    try {
      persister = createSyncStoragePersister({
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
      persistenceEnabled = true;
    } catch (err) {
      console.warn(
        '[PersistQueryClientProvider] Failed to initialize localStorage persister, falling back to memory-only persistence.',
        err,
      );
      persister = memoryPersister;
    }
  } else {
    console.warn(
      '[PersistQueryClientProvider] localStorage is not available, using memory-only persistence. Query cache will not persist across reloads.',
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        if (persistenceEnabled) {
          // Optional: Handle successful hydration
          console.log('%cQuery cache hydrated!', 'color:grey');
        } else {
          console.log('%cQuery cache running in memory-only mode.', 'color:orange');
        }
      }}
    >
      {children}
      {/* Show loading state while hydrating */}
      <HydrateLoader />
    </PersistQueryClientProvider>
  );
}
