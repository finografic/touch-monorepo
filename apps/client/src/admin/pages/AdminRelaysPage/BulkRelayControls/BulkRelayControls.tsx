import React from 'react';

import { Flex, Switch, Text } from '@radix-ui/themes';
import { Button } from 'components/Button';

import type { RelayHandlers, RelayMutations } from '../useRelayHandlers';

// ============================================================================
// Types
// ============================================================================

interface BulkRelayControlsProps {
  handlers: Pick<RelayHandlers, 'turnAllOn' | 'turnAllOff' | 'resetAll'>;
  mutations: Pick<RelayMutations, 'turnAllOn' | 'turnAllOff'>;
  isForceTestEnabled: boolean;
  onSetIsForceTestEnabled: (checked: boolean) => void;
}

// ============================================================================
// Component
// ============================================================================

export const BulkRelayControls: React.FC<BulkRelayControlsProps> = ({
  handlers,
  mutations,
  isForceTestEnabled,
  onSetIsForceTestEnabled,
}) => {
  return (
    <Flex className="status-buttons-all" align="center" gap="3" ml="8">
      <Flex className="status-dev-switch" gap="3" justify="between" align="center" pr="2">
        <Text size="3" weight="bold" color="gray" style={{ opacity: 0.66 }}>
          connection only
        </Text>
        <Switch
          size="3"
          checked={!isForceTestEnabled}
          color="gray"
          disabled={false}
          onCheckedChange={() => onSetIsForceTestEnabled(!isForceTestEnabled)}
          style={{ outline: 'none' }}
        />
      </Flex>

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
