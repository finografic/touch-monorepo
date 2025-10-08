import React, { useEffect, useState } from 'react';
import { Badge, Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { AdminContentLayout } from '../shared';
import { RelayGrid } from './RelayGrid';
import { SlotType } from 'types/orders.types';
import { styles } from './AdminRelaysPage.styles';
import { NUM_RELAYS } from './relays.config';
import { useGetRelayStates, useGetRelayStatus, useInitializeRelay } from 'queries/relays';
import { useRelayHandlers } from './useRelayHandlers';

// Types for relay configuration
interface RelayConfig {
  slotNumber: number;
  slotType: SlotType;
  isOn: boolean;
}

export const AdminRelaysPage: React.FC = () => {
  const { t } = useTranslation();

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
      <AdminContentLayout title="Relay Control" subtitle="Loading...">
        <Box className="loading">Loading relay states...</Box>
      </AdminContentLayout>
    );
  }

  if (statesError) {
    const isNetworkError =
      statesError.message?.includes('Network Error') || statesError.message?.includes('RPC Request Failed');

    return (
      <AdminContentLayout title="Relay Control" subtitle="Connection Error">
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
      </AdminContentLayout>
    );
  }

  return (
    <section css={styles} id="admin-relay-control">
      <AdminContentLayout
        title="Relay Control"
        subtitle={`Test and control the ${NUM_RELAYS}-channel relay board`}
      >
        <Box className="admin-relay-control">
          <Flex direction="column" gap="6">
            {/* Connection Status */}
            <Card size="3" variant="surface">
              <Flex justify="between" align="center">
                <Flex direction="column" gap="2">
                  <Heading size="4">Connection Status</Heading>
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
            </Card>

            {/* Relay Control */}
            <Card size="3" variant="surface">
              <Flex gap="4" justify="between">
                <Flex direction="column" gap="4">
                  <Flex justify="between" align="center">
                    <Heading size="4">Relay Control Grid</Heading>
                    <Flex gap="2" ml="4">
                      <Button
                        onClick={handleTurnAllOn}
                        disabled={turnAllOnMutation.isPending}
                        variant="solid"
                        color="green"
                        size="2"
                      >
                        {turnAllOnMutation.isPending ? 'Turning ON...' : 'All ON'}
                      </Button>
                      <Button
                        onClick={handleTurnAllOff}
                        disabled={turnAllOffMutation.isPending}
                        variant="solid"
                        color="red"
                        size="2"
                      >
                        {turnAllOffMutation.isPending ? 'Turning OFF...' : 'All OFF'}
                      </Button>
                      <Button
                        onClick={handleResetAll}
                        disabled={turnAllOffMutation.isPending}
                        variant="outline"
                        color="orange"
                        size="2"
                      >
                        {turnAllOffMutation.isPending ? 'Resetting...' : 'Reset All'}
                      </Button>
                    </Flex>
                  </Flex>
                  <RelayGrid
                    configurations={relayConfigs}
                    onRelayToggle={handleRelayToggle}
                    isLoading={toggleRelayMutation.isPending}
                  />
                </Flex>
                <Flex direction="column" gap="4">
                  <div className="slot-types-container">
                    <Heading size="4">Relay Status</Heading>
                    <div className="slot-legend">
                      <Flex direction="column" gap="3">
                        {relayConfigs.map((config) => (
                          <Flex
                            key={config.slotNumber}
                            align="center"
                            gap="4"
                            className={`legend-item ${config.isOn ? 'legend-relay-on' : 'legend-relay-off'}`}
                          >
                            <div>{config.slotNumber}</div>
                            <Text size="3">
                              Relay {config.slotNumber}: {config.isOn ? 'ON' : 'OFF'}
                            </Text>
                          </Flex>
                        ))}
                      </Flex>
                    </div>
                  </div>
                </Flex>
              </Flex>
            </Card>
          </Flex>
        </Box>
      </AdminContentLayout>
    </section>
  );
};
