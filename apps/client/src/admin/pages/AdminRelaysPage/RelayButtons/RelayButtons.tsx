import React from 'react';

import { Button, Flex } from '@radix-ui/themes';
import type { UseMutationResult } from '@tanstack/react-query';
import type { AxiosError } from 'api/axios-source';

import type { BulkRelayResponse } from 'queries/relays/useTurnAllRelaysOn';

import { useRelayHandlers } from '../useRelayHandlers';

// Types for relay configuration
interface RelayButtonsProps {
  handleTurnAllOn: () => void;
  handleTurnAllOff: () => void;
  handleResetAll: () => void;
  turnAllOnMutation: any;
  turnAllOffMutation: any;
  reconnectMutation: any;
  disconnectMutation: any;
}

export const RelayButtons: React.FC<RelayButtonsProps> = ({
  handleTurnAllOn,
  handleTurnAllOff,
  handleResetAll,
  turnAllOnMutation,
  turnAllOffMutation,
}) => {
  return (
    <Flex gap="2" ml="8" className="status-buttons-all">
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
  );
};
