import React, { useEffect, useState } from 'react';
import { Badge, Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { AdminContentLayout } from '../shared';
import { RelayGrid } from './RelayGrid';
import { SlotType } from 'types/orders.types';
import { styles } from './AdminRelaysPage.styles';
import { useToast } from 'components/Toast';
import { NUM_RELAYS } from './relays.config';
import {
  GET_RELAY_STATES_QUERYKEY,
  type RelayState,
  useDisconnectRelay,
  useGetRelayStates,
  useGetRelayStatus,
  useReconnectRelay,
  useToggleRelay,
  useTurnAllRelaysOff,
  useTurnAllRelaysOn,
} from 'queries/relays';

// Types for relay configuration
interface RelayConfig {
  slotNumber: number;
  slotType: SlotType;
  isOn: boolean;
}

export const AdminRelaysPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
  const toggleRelayMutation = useToggleRelay();
  const turnAllOnMutation = useTurnAllRelaysOn();
  const turnAllOffMutation = useTurnAllRelaysOff();
  const reconnectMutation = useReconnectRelay();
  const disconnectMutation = useDisconnectRelay();

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

  const handleRelayToggle = async (slotNumber: number, newState: boolean) => {
    try {
      await toggleRelayMutation.mutateAsync({ slotNumber, state: newState });
      toast({
        message: 'Relay Updated',
        subText: `Relay ${slotNumber} turned ${newState ? 'ON' : 'OFF'}`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        message: 'Error',
        subText: `Failed to toggle relay ${slotNumber}`,
        variant: 'error',
      });
    }
  };

  const handleTurnAllOn = async () => {
    try {
      await turnAllOnMutation.mutateAsync();
      toast({
        message: 'All Relays ON',
        subText: 'All relays have been turned ON',
        variant: 'success',
      });
    } catch (error) {
      toast({
        message: 'Error',
        subText: 'Failed to turn all relays ON',
        variant: 'error',
      });
    }
  };

  const handleTurnAllOff = async () => {
    try {
      await turnAllOffMutation.mutateAsync();
      toast({
        message: 'All Relays OFF',
        subText: 'All relays have been turned OFF',
        variant: 'success',
      });
    } catch (error) {
      toast({
        message: 'Error',
        subText: 'Failed to turn all relays OFF',
        variant: 'error',
      });
    }
  };

  const handleResetAll = async () => {
    try {
      // First turn all relays OFF (hardware reset)
      await turnAllOffMutation.mutateAsync();

      // Then invalidate queries to refresh UI state
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });

      toast({
        message: 'Reset Complete',
        subText: 'All relays have been reset to OFF',
        variant: 'success',
      });
    } catch (error) {
      toast({
        message: 'Error',
        subText: 'Failed to reset relays',
        variant: 'error',
      });
    }
  };

  const handleReconnect = async () => {
    try {
      if (relayStatus?.connected) {
        // Disconnect if currently connected
        await disconnectMutation.mutateAsync();
        toast({
          message: 'Disconnected',
          subText: 'Successfully disconnected from relay board',
          variant: 'success',
        });
      } else {
        // Reconnect if currently disconnected
        await reconnectMutation.mutateAsync();
        toast({
          message: 'Reconnection Attempted',
          subText: 'Attempting to reconnect to relay board',
          variant: 'info',
        });
      }
    } catch (error) {
      const action = relayStatus?.connected ? 'disconnect' : 'reconnect';
      toast({
        message: `${action === 'disconnect' ? 'Disconnection' : 'Reconnection'} Failed`,
        subText: `Failed to ${action} from relay board`,
        variant: 'error',
      });
    }
  };

  const handleRetryConnection = async () => {
    try {
      // Re-enable polling for both queries
      enableStatesPolling();
      enableStatusPolling();

      toast({
        message: 'Retrying Connection',
        subText: 'Attempting to reconnect to server...',
        variant: 'info',
      });
    } catch (error) {
      toast({
        message: 'Retry Failed',
        subText: 'Failed to retry connection',
        variant: 'error',
      });
    }
  };

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
              <Button onClick={handleRetryConnection} variant="solid" color="blue" size="3">
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
                    onClick={handleReconnect}
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
