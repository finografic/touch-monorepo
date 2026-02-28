import React from 'react';

import { Flex } from 'styled-system/jsx';
import { Switch } from '@workspace/design-system/components';
import { badge, dsSwitch } from 'styled-system/recipes';
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
        <span>{isNetworkError ? '🔴 Server Unavailable' : '⚠️ Connection Error'}</span>
        <span style={{ maxWidth: '600px' }}>
          {isNetworkError
            ? 'The development server appears to be stopped. Polling has been disabled to prevent conflicts.'
            : `Error loading relay states: ${statesError.message}`}
        </span>
        <Flex gap="3" align="center">
          <Button onClick={() => enableStatesPolling()} variant="solid" color="info">
            🔄 Retry Connection
          </Button>
          <span className={badge({ variant: 'soft', colorScheme: statesPollingEnabled ? 'success' : 'danger', size: 'lg' })}>
            Polling: {statesPollingEnabled ? 'Active' : 'Disabled'}
          </span>
        </Flex>
      </Flex>
    );
  }

  // ========================================================================
  // Normal Status Display
  // ========================================================================

  return (
    <Flex justify="space-between" align="center">
      <Flex direction="column" gap="2">
        <Flex align="center" gap="3" className="status-buttons">
          <span className={badge({ variant: 'soft', colorScheme: relayStatus?.connected ? 'success' : 'danger', size: 'lg' })}>
            {relayStatus?.connected ? 'Connected' : 'Disconnected'}
          </span>
          <span className={badge({ variant: 'soft', colorScheme: statesPollingEnabled ? 'success' : 'danger', size: 'lg' })}>
            Polling: {statesPollingEnabled ? 'Active' : 'Disabled'}
          </span>

          {relayStatus?.port && (
            <span>Port: {relayStatus.port}</span>
          )}
          {relayStatus?.error && (
            <span>Error: {relayStatus.error}</span>
          )}
        </Flex>
      </Flex>
      <Flex align="center" gap="3">
        {/* Global relay functionality toggle */}
        <Flex gap="2" align="center" pr="2">
          <span>Relay Functionality</span>
          <Switch.Root
            checked={isRelayFunctionalityEnabled}
            onCheckedChange={() => toggleRelayFunctionality()}
            style={{ outline: 'none' }}
          >
            <Switch.Control className={dsSwitch({ size: 'md' })}>
              <Switch.Thumb className="switch-thumb" />
            </Switch.Control>
            <Switch.HiddenInput />
          </Switch.Root>
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
