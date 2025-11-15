import React, { useEffect, useMemo, useState } from 'react';

import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { RelayAssign } from 'admin/pages/AdminRelaysPage/RelayAssign';
import { RelayButtons } from 'admin/pages/AdminRelaysPage/RelayButtons';

import { useGetRelayStates, useInitializeRelay } from 'queries/relays';
import { useGetSlotConfigurations } from 'queries/slot-configurations';

import type { SlotType } from 'types/slots.types';
import { AdminPageLayout, AdminSection } from '../..';
import { NUM_RELAYS } from './relays.config';
import { RelaysStatus } from './RelaysStatus';
import { useRelayHandlers } from './useRelayHandlers';
import { styles } from './AdminRelaysPage.styles';

// Types for relay configuration
interface RelayConfig {
  id: string;
  slotNumber: number;
  slotType: SlotType;
  relayNumber: number | null;
  isOn: boolean;
}

export const AdminRelaysPage: React.FC = () => {
  const {
    data: slotConfigurations,
    isSuccess,
    isLoading: isLoadingSlotConfigurations,
  } = useGetSlotConfigurations();

  // Initialize relay service on mount
  const initializeRelayMutation = useInitializeRelay();
  useEffect(() => {
    initializeRelayMutation.mutate();
  }, []);

  // Use custom hook for all relay handlers
  const { handlers, mutations } = useRelayHandlers();

  // TODO: API hooks - Only what THIS page needs
  const { data: relayStates, isLoading: isLoadingStates } = useGetRelayStates();

  // Note: Error handling moved to RelaysStatus component - it owns connection status!
  // Note: useGetRelayStatus removed - RelaysStatus calls it directly

  const isLoading = useMemo(
    () => isLoadingSlotConfigurations || isLoadingStates,
    [isLoadingSlotConfigurations, isLoadingStates],
  );

  // ======================================================================== //

  // Local state for relay configurations
  const [relayConfigs, setRelayConfigs] = useState<RelayConfig[]>([]);

  useEffect(
    function initializeRelayConfigs() {
      if (isSuccess && slotConfigurations) {
        const initialConfigs: RelayConfig[] = slotConfigurations.map((slotConfiguration) => ({
          id: slotConfiguration.id,
          slotNumber: slotConfiguration.slotNumber,
          slotType: slotConfiguration.slotType,
          relayNumber: slotConfiguration.relayNumber,
          isOn: false, // Will be updated from API
        }));
        setRelayConfigs(initialConfigs);
      }
    },
    [slotConfigurations, isSuccess],
  );

  // Update relay configurations when API data changes
  useEffect(
    function handleRelayStatesChange() {
      if (relayStates && relayStates.length > 0) {
        setRelayConfigs((prevConfigs) =>
          prevConfigs.map((config) => {
            const relayState = relayStates.find((state) => state.slotNumber === config.slotNumber);
            return {
              ...config,
              isOn: relayState?.isOn ?? false,
            };
          }),
        );
      }
    },
    [relayStates],
  );

  // Show loading state while fetching slot configurations
  if (isLoading) {
    return (
      <AdminPageLayout title="Relay Control" isLoading={true} styles={styles}>
        <Box />
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Relay Control"
      description={`Test and control the ${NUM_RELAYS}-channel relay board`}
      styles={styles}
    >
      <AdminSection title="Connection Status" variant="border-solid">
        <RelaysStatus />
      </AdminSection>
      <Box className="admin-relay-control">
        <Flex direction="column" gap="6">
          <Flex direction="column" gap="4">
            <AdminSection title="Relay Boards" variant="border-solid">
              <Flex justify="end" align="center" mt="-6" mb="2">
                <RelayButtons handlers={handlers} mutations={mutations} />
              </Flex>
              <RelayAssign
                configurations={relayConfigs}
                onRelayToggle={handlers.relayToggle}
                isLoading={mutations.toggleRelay.isPending}
              />
            </AdminSection>
          </Flex>
        </Flex>
      </Box>
    </AdminPageLayout>
  );
};
