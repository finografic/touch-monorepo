import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HydrateLoader } from 'routes/components/HydrateLoader';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { QueryDevtoolsPanel } from './QueryDevtoolsPanel';

export default function ({ children }: { children: React.ReactNode }) {
  const [isHydrating, setIsHydrating] = useState(true);
  const [queryClient] = useState(
    () =>
      new QueryClient({
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
      }),
  );

  // Handle initial hydration
  React.useEffect(() => {
    setIsHydrating(false);
  }, []);

  if (isHydrating) {
    return <HydrateLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen /> */}
      {/* <QueryDevtoolsPanel /> */}
    </QueryClientProvider>
  );
}
