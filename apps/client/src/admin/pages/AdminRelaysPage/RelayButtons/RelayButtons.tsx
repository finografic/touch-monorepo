import React from 'react';

import { Button, Flex } from '@radix-ui/themes';

import type { RelayHandlers, RelayMutations } from '../useRelayHandlers';

// ============================================================================
// Types
// ============================================================================

interface RelayButtonsProps {
  handlers: Pick<RelayHandlers, 'turnAllOn' | 'turnAllOff' | 'resetAll'>;
  mutations: Pick<RelayMutations, 'turnAllOn' | 'turnAllOff'>;
}

// ============================================================================
// Component
// ============================================================================

export const RelayButtons: React.FC<RelayButtonsProps> = ({ handlers, mutations }) => {
  return (
    <Flex gap="2" ml="8" className="status-buttons-all">
      <Button
        onClick={handlers.turnAllOn}
        disabled={mutations.turnAllOn.isPending}
        variant="solid"
        color="green"
        size="2"
      >
        {mutations.turnAllOn.isPending ? 'Turning ON...' : 'All ON'}
      </Button>
      <Button
        onClick={handlers.turnAllOff}
        disabled={mutations.turnAllOff.isPending}
        variant="solid"
        color="red"
        size="2"
      >
        {mutations.turnAllOff.isPending ? 'Turning OFF...' : 'All OFF'}
      </Button>
      <Button
        onClick={handlers.resetAll}
        disabled={mutations.turnAllOff.isPending}
        variant="outline"
        color="orange"
        size="2"
      >
        {mutations.turnAllOff.isPending ? 'Resetting...' : 'Reset All'}
      </Button>
    </Flex>
  );
};
