import React from 'react';
import { Badge } from '@finografic/design-system/components';
import { SwitchDS } from '@finografic/design-system/forms';

import { Flex } from 'styled-system/jsx';
import { Button } from 'components/Button';
import { Loader } from 'components/Loader/Loader';

import { getQueryErrorMessage, isRelayNetworkLikeError } from 'api/relay-query.utils';
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
    const errorMessage = getQueryErrorMessage(statesError) ?? 'Unknown error';
    const isNetworkError = isRelayNetworkLikeError(statesError);

    return (
      <Flex direction="column" gap={4} align="center" py={6}>
        <span>{isNetworkError ? '🔴 Server Unavailable' : '⚠️ Connection Error'}</span>
        <span style={{ maxWidth: '600px' }}>
          {isNetworkError
            ? 'The development server appears to be stopped. Polling has been disabled to prevent conflicts.'
            : `Error loading relay states: ${errorMessage}`}
        </span>
        <Flex gap={3} align="center">
          <Button onClick={() => enableStatesPolling()} variant="solid" color="info">
            🔄 Retry Connection
          </Button>
          <Badge variant="soft" palette={statesPollingEnabled ? 'success' : 'danger'} size="lg">
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
    <Flex justify="space-between" align="center">
      <Flex direction="column" gap={2}>
        <Flex align="center" gap={3} className="status-buttons">
          <Badge variant="soft" palette={relayStatus?.connected ? 'success' : 'danger'} size="lg">
            {relayStatus?.connected ? 'Connected' : 'Disconnected'}
          </Badge>
          <Badge variant="soft" palette={statesPollingEnabled ? 'success' : 'danger'} size="lg">
            Polling: {statesPollingEnabled ? 'Active' : 'Disabled'}
          </Badge>

          {relayStatus?.port && <span>Port: {relayStatus.port}</span>}
          {relayStatus?.message && <span>Message: {relayStatus.message}</span>}
        </Flex>
      </Flex>
      <Flex align="center" gap={3}>
        {/* Global relay functionality toggle */}
        <Flex gap={2} align="center" pr={2}>
          <span>Relay Functionality</span>
          <SwitchDS
            label="Relay Functionality"
            palette="success"
            checked={isRelayFunctionalityEnabled}
            onChange={() => toggleRelayFunctionality()}
          />
        </Flex>

        <Button
          onClick={() => handlers.reconnect(relayStatus)}
          disabled={!isRelayFunctionalityEnabled || mutations.reconnect.isPending
            || mutations.disconnect.isPending}
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
