import React, { useCallback, useEffect, useState } from 'react';

import { Badge, Box, Button, Flex, Text } from '@radix-ui/themes';

import { useTimers } from 'providers/TimersProvider';
import { useGetRelayStates, useGetRelayStatus, useInitializeRelay } from 'queries/relays';

import { SlotType } from 'types/orders.types';
import { AdminPageLayout, AdminSection } from '../..';
import { RelayDefrost } from './RelayDefrost/RelayDefrost';
import { NUM_RELAYS } from './relays.config';
import { useRelayHandlers } from './useRelayHandlers';
import { styles } from './AdminRelaysPage.styles';

// Types for relay configuration
interface RelayConfig {
  slotNumber: number;
  slotType: SlotType;
  isOn: boolean;
}

export const PublicRelaysPage: React.FC = () => {
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
    disablePolling: disableStatesPolling,
  } = useGetRelayStates();

  const {
    data: relayStatus,
    isLoading: isLoadingStatus,
    isPollingEnabled: statusPollingEnabled,
    enablePolling: enableStatusPolling,
    disablePolling: disableStatusPolling,
  } = useGetRelayStatus();

  // Local state for relay configurations
  const [relayConfigs, setRelayConfigs] = useState<RelayConfig[]>([]);

  // Initialize relay configurations
  useEffect(() => {
    const initialConfigs: RelayConfig[] = Array.from({ length: NUM_RELAYS }, (_, index) => ({
      slotNumber: index + 1,
      slotType: SlotType.B, // Default slot type
      isOn: false, // Will be updated from API
    }));
    setRelayConfigs(initialConfigs);
  }, []);

  // Update relay configurations when API data changes
  useEffect(() => {
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
  }, [relayStates]);

  if (isLoadingStates) {
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
      title="Maintenance"
      subtitle="User"
      description={`Test and control the ${NUM_RELAYS}-channel relay board`}
      styles={styles}
    >
      <AdminSection
        title="Connection Status"
        description="Choose the default mode that will be used when no specific mode is selected"
        variant="border-solid"
      >
        <Flex justify="between" align="center">
          <Flex direction="column" gap="2">
            <Flex align="center" gap="3">
              <Badge color={relayStatus?.connected ? 'green' : 'red'} variant="soft" size="3">
                {relayStatus?.connected ? 'Connected' : 'Disconnected'}
              </Badge>
              <Badge color={statesPollingEnabled ? 'green' : 'red'} variant="soft" size="3">
                Polling: {statesPollingEnabled ? 'Active' : 'Disabled'}
              </Badge>

              {relayStatus?.port && (
                <Text size="2" color="gray">
                  Port: {relayStatus.port}
                </Text>
              )}
              {relayStatus?.error && (
                <Text size="2" color="red">
                  Error: {relayStatus.error}
                </Text>
              )}
            </Flex>
          </Flex>
          <Flex align="center" gap="3">
            <Button
              onClick={() => handleReconnect(relayStatus)}
              disabled={reconnectMutation.isPending || disconnectMutation.isPending}
              variant="outline"
              size="2"
            >
              {reconnectMutation.isPending || disconnectMutation.isPending
                ? relayStatus?.connected
                  ? 'Disconnecting...'
                  : 'Reconnecting...'
                : relayStatus?.connected
                  ? 'Disconnect'
                  : 'Reconnect'}
            </Button>
          </Flex>
        </Flex>
      </AdminSection>
      <Box className="admin-relay-control">
        <Flex direction="column" gap="6">
          <RelayDefrost />
        </Flex>
      </Box>
    </AdminPageLayout>
  );
};
