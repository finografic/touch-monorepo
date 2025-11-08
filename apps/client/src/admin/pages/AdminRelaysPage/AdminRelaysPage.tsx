import React, { useEffect, useMemo, useState } from 'react';

import { Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { RelayAssign } from 'admin/pages/AdminRelaysPage/RelayAssign';
import { RelayButtons } from 'admin/pages/AdminRelaysPage/RelayButtons';

import { useGetRelayStates, useGetRelayStatus, useInitializeRelay } from 'queries/relays';
import { useGetSlotConfigurations } from 'queries/slot-configurations';
import type { SlotType } from 'types/orders.types';

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
  const {
    handleRelayToggle,
    handleTurnAllOn,
    handleTurnAllOff,
    handleResetAll,
    handleReconnect,
    handleRetryConnection,
    toggleRelayMutation,
    turnAllOnMutation,
    turnAllOffMutation,
    reconnectMutation,
    disconnectMutation,
  } = useRelayHandlers();

  // API hooks with smart polling
  const {
    data: relayStates,
    isLoading: isLoadingStates,
    error: statesError,
    isPollingEnabled: statesPollingEnabled,
    enablePolling: enableStatesPolling,
  } = useGetRelayStates();

  const {
    data: relayStatus,
    isLoading: isLoadingStatus,
    isPollingEnabled: statusPollingEnabled,
    enablePolling: enableStatusPolling,
    disablePolling: disableStatusPolling,
  } = useGetRelayStatus();

  const isLoading = useMemo(
    () => isLoadingSlotConfigurations || isLoadingStates || isLoadingStatus,
    [isLoadingSlotConfigurations, isLoadingStates, isLoadingStatus],
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

  if (isLoading) {
    return (
      <AdminPageLayout title="Relay Control" subtitle="Loading..." styles={styles}>
        <Box className="loading">Loading relay states...</Box>
      </AdminPageLayout>
    );
  }

  if (statesError) {
    const isNetworkError =
      statesError.message?.includes('Network Error') || statesError.message?.includes('RPC Request Failed');

    return (
      <AdminPageLayout title="Relay Control" subtitle="Connection Error" styles={styles}>
        <Box className="error">
          <Flex direction="column" gap="4" align="center">
            <Text color="red" size="4" weight="bold">
              {isNetworkError ? 'Server Unavailable' : 'Error'}
            </Text>
            <Text color="gray" size="3">
              {isNetworkError
                ? 'The development server appears to be stopped. Polling has been disabled to prevent conflicts.'
                : `Error loading relay states: ${statesError.message}`}
            </Text>
            <Flex gap="3" align="center">
              <Button
                onClick={() => handleRetryConnection(enableStatesPolling, enableStatusPolling)}
                variant="solid"
                color="blue"
                size="3"
              >
                🔄 Retry Connection
              </Button>
              <Text size="2" color="gray">
                Polling: {statesPollingEnabled ? '🟢 Active' : '🔴 Disabled'}
              </Text>
            </Flex>
          </Flex>
        </Box>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Relay Control"
      description={`Test and control the ${NUM_RELAYS}-channel relay board`}
      styles={styles}
    >
      <Box className="admin-relay-control">
        <Flex direction="column" gap="6">
          {/* ====================================================================== */}
          <RelaysStatus />
          {/* ====================================================================== */}
          {/* <Card size="3" variant="surface"> */}
          <Flex direction="column" gap="4">
            <AdminSection
              title="Relay Board One"
              variant="border-solid"
              // description="Add new alarm sound files to your library (MP3, WAV, AIFF supported - AIFF/WAV files are automatically converted to MP3 for optimal web compatibility and smaller file sizes)"
            >
              <Flex justify="start" align="center" gap="3">
                <Heading size="4">Relay Control Grid</Heading>
                <RelayButtons
                  handleTurnAllOn={handleTurnAllOn}
                  handleTurnAllOff={handleTurnAllOff}
                  handleResetAll={handleResetAll}
                  turnAllOnMutation={turnAllOnMutation}
                  turnAllOffMutation={turnAllOffMutation}
                  reconnectMutation={reconnectMutation}
                  disconnectMutation={disconnectMutation}
                />
              </Flex>
              {/* ====================================================================== */}
              <RelayAssign
                configurations={relayConfigs}
                onRelayToggle={handleRelayToggle}
                isLoading={toggleRelayMutation.isPending}
              />
              {/* ====================================================================== */}
            </AdminSection>
          </Flex>
          {/* </Card> */}
        </Flex>
      </Box>
    </AdminPageLayout>
  );
};
