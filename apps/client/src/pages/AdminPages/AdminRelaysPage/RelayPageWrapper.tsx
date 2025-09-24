import React, { useEffect } from 'react';
import { AdminRelaysPage } from 'pages/AdminPages/AdminRelaysPage/AdminRelaysPage';
import { useInitializeRelay } from 'queries/relays';

export const RelayPageWrapper: React.FC = () => {
  const initializeRelayMutation = useInitializeRelay();

  useEffect(() => {
    // Initialize the relay service when the page loads
    initializeRelayMutation.mutate();
  }, []);

  return <AdminRelaysPage />;
};
