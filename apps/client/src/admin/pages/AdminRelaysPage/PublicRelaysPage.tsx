import React, { useEffect } from 'react';

import { Box, Flex } from '@radix-ui/themes';

import { useInitializeRelay } from 'queries/relays';

import { AdminPageLayout, AdminSection } from '../..';
import { RelayDefrost } from './RelayDefrost/RelayDefrost';
import { RelaysStatus } from './RelaysStatus';
import { NUM_RELAYS } from './relays.config';
import { styles } from './AdminRelaysPage.styles';

export const PublicRelaysPage: React.FC = () => {
  // Initialize relay service on mount
  const initializeRelayMutation = useInitializeRelay();
  useEffect(() => {
    initializeRelayMutation.mutate();
  }, []);

  // Note: All state management moved to child components!
  // - RelaysStatus handles connection status, errors, and retry
  // - RelayDefrost handles maintenance timer controls

  return (
    <AdminPageLayout
      title="Maintenance"
      subtitle="User"
      description={`Test and control the ${NUM_RELAYS}-channel relay board`}
      styles={styles}
    >
      <AdminSection title="Connection Status" variant="border-solid">
        <RelaysStatus />
      </AdminSection>
      <AdminSection title="Desescarche" variant="border-solid">
        <Box className="admin-relay-control">
          <Flex direction="column" gap="6">
            <RelayDefrost />
          </Flex>
        </Box>
      </AdminSection>
    </AdminPageLayout>
  );
};
