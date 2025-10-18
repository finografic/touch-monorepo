import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'components/Toast';

import { GET_RELAY_STATES_QUERYKEY,  useDisconnectRelay,  useReconnectRelay,  useToggleRelay,  useTurnAllRelaysOff,  useTurnAllRelaysOn } from 'queries/relays';

export const useRelayHandlers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation hooks
  const toggleRelayMutation = useToggleRelay();
  const turnAllOnMutation = useTurnAllRelaysOn();
  const turnAllOffMutation = useTurnAllRelaysOff();
  const reconnectMutation = useReconnectRelay();
  const disconnectMutation = useDisconnectRelay();

  const handleRelayToggle = useCallback(
    async (slotNumber: number, newState: boolean) => {
      try {
        await toggleRelayMutation.mutateAsync({ slotNumber, state: newState });
        toast({
          message: 'Relay Updated',
          subText: `Relay ${slotNumber} turned ${newState ? 'ON' : 'OFF'}`,
          variant: 'success',
        });
      } catch (error) {
        toast({
          message: 'Error',
          subText: `Failed to toggle relay ${slotNumber}`,
          variant: 'error',
        });
      }
    },
    [toggleRelayMutation, toast],
  );

  const handleTurnAllOn = useCallback(async () => {
    try {
      await turnAllOnMutation.mutateAsync();
      toast({
        message: 'All Relays ON',
        subText: 'All relays have been turned ON',
        variant: 'success',
      });
    } catch (error) {
      toast({
        message: 'Error',
        subText: 'Failed to turn all relays ON',
        variant: 'error',
      });
    }
  }, [turnAllOnMutation, toast]);

  const handleTurnAllOff = useCallback(async () => {
    try {
      await turnAllOffMutation.mutateAsync();
      toast({
        message: 'All Relays OFF',
        subText: 'All relays have been turned OFF',
        variant: 'success',
      });
    } catch (error) {
      toast({
        message: 'Error',
        subText: 'Failed to turn all relays OFF',
        variant: 'error',
      });
    }
  }, [turnAllOffMutation, toast]);

  const handleResetAll = useCallback(async () => {
    try {
      // First turn all relays OFF (hardware reset)
      await turnAllOffMutation.mutateAsync();

      // Then invalidate queries to refresh UI state
      queryClient.invalidateQueries({ queryKey: [...GET_RELAY_STATES_QUERYKEY] });

      toast({
        message: 'Reset Complete',
        subText: 'All relays have been reset to OFF',
        variant: 'success',
      });
    } catch (error) {
      toast({
        message: 'Error',
        subText: 'Failed to reset relays',
        variant: 'error',
      });
    }
  }, [turnAllOffMutation, queryClient, toast]);

  const handleReconnect = useCallback(
    async (relayStatus?: { connected?: boolean }) => {
      try {
        if (relayStatus?.connected) {
          // Disconnect if currently connected
          await disconnectMutation.mutateAsync();
          toast({
            message: 'Disconnected',
            subText: 'Successfully disconnected from relay board',
            variant: 'success',
          });
        } else {
          // Reconnect if currently disconnected
          await reconnectMutation.mutateAsync();
          toast({
            message: 'Reconnection Attempted',
            subText: 'Attempting to reconnect to relay board',
            variant: 'info',
          });
        }
      } catch (error) {
        const action = relayStatus?.connected ? 'disconnect' : 'reconnect';
        toast({
          message: `${action === 'disconnect' ? 'Disconnection' : 'Reconnection'} Failed`,
          subText: `Failed to ${action} from relay board`,
          variant: 'error',
        });
      }
    },
    [disconnectMutation, reconnectMutation, toast],
  );

  const handleRetryConnection = useCallback(
    (enableStatesPolling: () => void, enableStatusPolling: () => void) => {
      try {
        // Re-enable polling for both queries
        enableStatesPolling();
        enableStatusPolling();

        toast({
          message: 'Retrying Connection',
          subText: 'Attempting to reconnect to server...',
          variant: 'info',
        });
      } catch (error) {
        toast({
          message: 'Retry Failed',
          subText: 'Failed to retry connection',
          variant: 'error',
        });
      }
    },
    [toast],
  );

  return {
    // Handlers
    handleRelayToggle,
    handleTurnAllOn,
    handleTurnAllOff,
    handleResetAll,
    handleReconnect,
    handleRetryConnection,
    // Mutation states for UI
    toggleRelayMutation,
    turnAllOnMutation,
    turnAllOffMutation,
    reconnectMutation,
    disconnectMutation,
  };
};
