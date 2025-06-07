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
            retry: false, // Disable retries for local development
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
