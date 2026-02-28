import React, { useEffect } from 'react';

import { Box, Flex } from 'styled-system/jsx';
import { AdminPageLayout, AdminSection } from 'admin/components';
import { DEFROST_SLOT_NUMBER } from 'admin/config/admin.slots.config';
import { Button } from 'components/Button';
import { DefrostTimer } from 'components/Timers/DefrostTimer';

import { useTimers } from 'providers/TimersProvider';
import { useInitializeRelay } from 'queries/relays';

import { RelaysConnectionStatus } from './RelaysConnectionStatus';
import { styles } from './AdminRelaysPage.styles';

export const PublicRelaysPage: React.FC = () => {
  // Maintenance timer controls (slot 15 default, 10 minutes)
  const { startDefrostTimer, stopDefrostTimer } = useTimers();

  // Initialize relay service on mount
  const initializeRelayMutation = useInitializeRelay();
  useEffect(() => {
    initializeRelayMutation.mutate();
  }, []);

  // Note: All state management moved to child components!
  // - RelaysStatus handles connection status, errors, and retry
  // - RelayDefrostTimer handles maintenance timer controls

  return (
    <AdminPageLayout
      title={'admin.pages.relays_public.title'}
      description={'admin.pages.relays_public.description'}
      styles={styles}
    >
      <AdminSection title="Connection Status" variant="border-solid">
        <RelaysConnectionStatus />
      </AdminSection>
      <AdminSection title="Desescarche" variant="border-solid">
        <Box className="admin-relay-control">
          <Flex direction="column" gap={2} style={{ marginTop: '-1rem' }}>
            <DefrostTimer slotNumber={DEFROST_SLOT_NUMBER} />
            <Flex justify="space-between" align="center">
              <Flex gap={2}>
                <Button
                  onClick={() => startDefrostTimer(DEFROST_SLOT_NUMBER, 600)}
                  variant="solid"
                  color="success"
                  size="sm"
                >
                  Start
                </Button>
                <Button
                  onClick={() => stopDefrostTimer(DEFROST_SLOT_NUMBER)}
                  variant="outline"
                  color="warning"
                  size="sm"
                >
                  Stop
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </AdminSection>
    </AdminPageLayout>
  );
};
