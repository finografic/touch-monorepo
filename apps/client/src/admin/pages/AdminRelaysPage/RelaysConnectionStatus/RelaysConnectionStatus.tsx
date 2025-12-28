import React from 'react';

import { Badge, Flex, Switch, Text } from '@radix-ui/themes';
import { Button } from 'components/Button';
import { Loader } from 'components/Loader/Loader';

import { useAppConfig } from 'providers/AppConfigProvider';
import { useGetRelayStates, useGetRelayStatus } from 'queries/relays';

import { useRelayHandlers } from '../useRelayHandlers';

// ============================================================================
// Component
// ============================================================================

export const RelaysConnectionStatus: React.FC = () => {
  const { handlers, mutations } = useRelayHandlers();

  // Global relay functionality state from AppConfig
  const { isRelayFunctionalityEnabled, toggleRelayFunctionality } = useAppConfig();

  // Call hooks directly - this component owns connection status!
  const {
    isLoading: isLoadingStates,
    isPollingEnabled: statesPollingEnabled,
    error: statesError,
    enablePolling: enableStatesPolling,
  } = useGetRelayStates();

  const { data: relayStatus } = useGetRelayStatus();

  // ========================================================================
  // Loading State
  // ========================================================================

  if (isLoadingStates) {
    return <Loader message="Loading relay states..." />;
  }

  // ========================================================================
  // Error State
  // ========================================================================

  if (statesError) {
    const isNetworkError =
      statesError.message?.includes('Network Error') || statesError.message?.includes('RPC Request Failed');

    return (
      <Flex direction="column" gap="4" align="center" py="6">
        <Text color="red" size="5" weight="bold">
          {isNetworkError ? '🔴 Server Unavailable' : '⚠️ Connection Error'}
        </Text>
        <Text color="gray" size="3" align="center" style={{ maxWidth: '600px' }}>
          {isNetworkError
            ? 'The development server appears to be stopped. Polling has been disabled to prevent conflicts.'
            : `Error loading relay states: ${statesError.message}`}
        </Text>
        <Flex gap="3" align="center">
          <Button onClick={() => enableStatesPolling()} variant="solid" color="info">
            🔄 Retry Connection
          </Button>
          <Badge color={statesPollingEnabled ? 'green' : 'red'} variant="soft" size="3">
            Polling: {statesPollingEnabled ? 'Active' : 'Disabled'}
          </Badge>
        </Flex>
      </Flex>
    );
  }

  // ========================================================================
  // Normal Status Display
  // ========================================================================

  return (
    <Flex justify="between" align="center">
      <Flex direction="column" gap="2">
        <Flex align="center" gap="3" className="status-buttons">
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
        {/* Global relay functionality toggle */}
        <Flex gap="2" align="center" pr="2">
          <Text size="2" weight="medium" color="gray">
            Relay Functionality
          </Text>
          <Switch
            size="2"
            checked={isRelayFunctionalityEnabled}
            color={isRelayFunctionalityEnabled ? 'green' : 'gray'}
            onCheckedChange={toggleRelayFunctionality}
            style={{ outline: 'none' }}
          />
        </Flex>

        <Button
          onClick={() => handlers.reconnect(relayStatus)}
          disabled={
            !isRelayFunctionalityEnabled || mutations.reconnect.isPending || mutations.disconnect.isPending
          }
          variant="outline"
          size="sm"
        >
          {mutations.reconnect.isPending || mutations.disconnect.isPending
            ? relayStatus?.connected
              ? 'Disconnecting...'
              : 'Reconnecting...'
            : relayStatus?.connected
              ? 'Disconnect'
              : 'Reconnect'}
        </Button>
      </Flex>
    </Flex>
  );
};
