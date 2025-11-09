import React from 'react';

import { Badge, Button, Flex, Text } from '@radix-ui/themes';
import { Loader } from 'components/Loader/Loader';

import { useGetRelayStates, useGetRelayStatus } from 'queries/relays';

import { useRelayHandlers } from '../useRelayHandlers';

export const RelaysStatus: React.FC = () => {
  const { handlers, mutations } = useRelayHandlers();
  const { isLoading: isLoadingStates, isPollingEnabled: statesPollingEnabled } = useGetRelayStates();

  const { data: relayStatus } = useGetRelayStatus();

  if (isLoadingStates) {
    return <Loader message="Loading relay states..." />;
  }

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
        <Button
          onClick={() => handlers.reconnect(relayStatus)}
          disabled={mutations.reconnect.isPending || mutations.disconnect.isPending}
          variant="outline"
          size="2"
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
