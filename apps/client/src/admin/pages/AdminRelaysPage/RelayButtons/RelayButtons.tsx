import React from 'react';

import { Flex } from '@radix-ui/themes';
import { Button } from 'components/Button';

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
        color="success"
        size="sm"
      >
        {mutations.turnAllOn.isPending ? 'Turning ON...' : 'All ON'}
      </Button>
      <Button
        onClick={handlers.turnAllOff}
        disabled={mutations.turnAllOff.isPending}
        variant="solid"
        color="danger"
        size="sm"
      >
        {mutations.turnAllOff.isPending ? 'Turning OFF...' : 'All OFF'}
      </Button>
      <Button
        onClick={handlers.resetAll}
        disabled={mutations.turnAllOff.isPending}
        variant="outline"
        color="warning"
        size="sm"
      >
        {mutations.turnAllOff.isPending ? 'Resetting...' : 'Reset All'}
      </Button>
    </Flex>
  );
};
