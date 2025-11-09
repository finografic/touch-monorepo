import React, { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { QueryDevtoolsPanel } from './QueryDevtoolsPanel';

export default function ({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
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
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen /> */}
      {/* <QueryDevtoolsPanel /> */}
    </QueryClientProvider>
  );
}
