import React from 'react';
import { Badge, Button } from '@finografic/design-system/components';
import { SwitchDS } from '@finografic/design-system/forms';

import { Flex } from 'styled-system/jsx';
import { useAppConfig } from 'providers/AppConfigProvider';
import { probeRelayConnection, useRelayConnection } from 'queries/relays';

import { useRelayHandlers } from '../useRelayHandlers';

// ============================================================================
// Component
// ============================================================================

export const RelaysConnectionStatus: React.FC = () => {
  const { handlers, mutations } = useRelayHandlers();

  const { isRelayFunctionalityEnabled, toggleRelayFunctionality } = useAppConfig();

  // Reads from the vanilla relay.store — re-renders only on connection changes
  const { connected, port, message, networkError } = useRelayConnection();

  // ========================================================================
  // Network Error State (server unreachable)
  // ========================================================================

  if (networkError) {
    return (
      <Flex direction="column" gap={4} align="center" py={6}>
        <span>🔴 Server Unavailable</span>
        <span style={{ maxWidth: '600px' }}>
          The development server appears to be stopped. Connection probing will resume automatically.
        </span>
        <Flex gap={3} align="center">
          <Button onClick={() => probeRelayConnection()} variant="solid" palette="info">
            🔄 Retry Connection
          </Button>
          <Badge variant="soft" palette="danger" size="lg">
            Polling: Active
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
          <Badge variant="soft" palette={connected ? 'success' : 'danger'} size="lg">
            {connected ? 'Connected' : 'Disconnected'}
          </Badge>
          <Badge variant="soft" palette="success" size="lg">
            Polling: Active
          </Badge>

          {port && <span>Port: {port}</span>}
          {message && <span>Message: {message}</span>}
        </Flex>
      </Flex>
      <Flex align="center" gap={3}>
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
          onClick={() => handlers.reconnect({ connected })}
          disabled={!isRelayFunctionalityEnabled || mutations.reconnect.isPending || mutations.disconnect.isPending}
          variant="outline"
          size="sm"
        >
          {mutations.reconnect.isPending || mutations.disconnect.isPending
            ? connected
              ? 'Disconnecting...'
              : 'Reconnecting...'
            : connected
            ? 'Disconnect'
            : 'Reconnect'}
        </Button>
      </Flex>
    </Flex>
  );
};
