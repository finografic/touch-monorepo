import React, { useCallback, useEffect } from 'react';

import { Button, Card, Flex, Heading } from '@radix-ui/themes';
import { UserTimer } from 'components/Timers/UserTimer';

import { useTimers } from 'providers/TimersProvider';
import { useInitializeRelay } from 'queries/relays';

import type { SlotType } from 'types/orders.types';

// Types for relay configuration
interface RelayConfig {
  slotNumber: number;
  slotType: SlotType;
  isOn: boolean;
}

export const RelayDefrost: React.FC = () => {
  // Maintenance timer controls (slot 15 default, 10 minutes)
  const timersStore = useTimers();

  const startMaintenance = useCallback(() => {
    timersStore.startMaintenanceTimer(15, 600);
  }, [timersStore]);

  const stopMaintenance = useCallback(() => {
    timersStore.stopMaintenanceTimer(15);
  }, [timersStore]);

  const resetMaintenance = useCallback(() => {
    timersStore.resetMaintenanceTimer(15, 600);
  }, [timersStore]);

  // Initialize relay service on mount
  const initializeRelayMutation = useInitializeRelay();
  useEffect(() => {
    initializeRelayMutation.mutate();
  }, []);

  return (
    <Flex gap="4" justify="between">
      <Flex direction="column" gap="4">
        <Flex gap="2">
          <UserTimer slotNumber={15} />
        </Flex>
        <Flex justify="between" align="center">
          <Flex gap="2">
            <Button onClick={startMaintenance} variant="solid" color="green" size="4">
              Iniciar
            </Button>
            <Button onClick={stopMaintenance} variant="outline" color="orange" size="4">
              Cancelar
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
