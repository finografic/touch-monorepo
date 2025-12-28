import React from 'react';

import { Flex } from '@radix-ui/themes';
import { Button } from 'components/Button';

import { useAppConfig } from 'providers/AppConfigProvider';

import type { RelayHandlers, RelayMutations } from '../useRelayHandlers';

// ============================================================================
// Types
// ============================================================================

interface BulkRelayControlsProps {
  handlers: Pick<RelayHandlers, 'turnAllOn' | 'turnAllOff' | 'resetAll'>;
  mutations: Pick<RelayMutations, 'turnAllOn' | 'turnAllOff'>;
}

// ============================================================================
// Component
// ============================================================================

export const BulkRelayControls: React.FC<BulkRelayControlsProps> = ({ handlers, mutations }) => {
  const { isRelayFunctionalityEnabled } = useAppConfig();

  return (
    <Flex className="status-buttons-all" align="center" gap="3" ml="8">
      <Button
        onClick={handlers.turnAllOn}
        disabled={!isRelayFunctionalityEnabled || mutations.turnAllOn.isPending}
        variant="solid"
        color="success"
        size="sm"
      >
        {mutations.turnAllOn.isPending ? 'Turning ON...' : 'All ON'}
      </Button>
      <Button
        onClick={handlers.turnAllOff}
        disabled={!isRelayFunctionalityEnabled || mutations.turnAllOff.isPending}
        variant="solid"
        color="danger"
        size="sm"
      >
        {mutations.turnAllOff.isPending ? 'Turning OFF...' : 'All OFF'}
      </Button>
      <Button
        onClick={handlers.resetAll}
        disabled={!isRelayFunctionalityEnabled || mutations.turnAllOff.isPending}
        variant="outline"
        color="warning"
        size="sm"
      >
        {mutations.turnAllOff.isPending ? 'Resetting...' : 'Reset All'}
      </Button>
    </Flex>
  );
};
