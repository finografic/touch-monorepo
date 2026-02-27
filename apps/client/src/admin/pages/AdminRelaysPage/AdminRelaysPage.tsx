import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Flex } from 'styled-system/jsx';
import { AdminPageLayout, AdminSection } from 'admin/components';
import { BulkRelayControls } from 'admin/pages/AdminRelaysPage/BulkRelayControls';
import { RelaysTable } from 'admin/pages/AdminRelaysPage/RelaysTable';

import { useAppConfig } from 'providers/AppConfigProvider';
import { useInitializeRelay, useStableRelayStates } from 'queries/relays';
import { useGetSlotConfigurations } from 'queries/slot-configurations';

import type { SlotType } from 'types/slots.types';
import { RelaysConnectionStatus } from './RelaysConnectionStatus';
import { useRelayHandlers } from './useRelayHandlers';
import { styles } from './AdminRelaysPage.styles';

interface RelayConfig {
  id: string;
  slotNumber: number;
  slotType: SlotType;
  relayNumber: number | null;
  isActive: boolean;
  isOn: boolean;
}

export const AdminRelaysPage: React.FC = () => {
  const { isRelayFunctionalityEnabled } = useAppConfig();

  const {
    data: slotConfigurations,
    isSuccess,
    isLoading: isLoadingSlotConfigurations,
  } = useGetSlotConfigurations();

  // Initialize relay service on mount - only if relay functionality is enabled
  const initializeRelayMutation = useInitializeRelay();
  useEffect(() => {
    if (isRelayFunctionalityEnabled) {
      initializeRelayMutation.mutate();
    }
  }, [isRelayFunctionalityEnabled, initializeRelayMutation]);

  // Use custom hook for all relay handlers
  const { handlers, mutations } = useRelayHandlers();

  // Use stable wrapper hook that only updates when isOn values actually change
  // This prevents cascading re-renders throughout the page
  // Note: useGetRelayStates is called in RelaysStatus component for status display
  // React Query will deduplicate the calls automatically
  const { data: relayStates, isLoading: isLoadingStates } = useStableRelayStates();

  // Stabilize mutation pending state to prevent unnecessary re-renders
  // Use ref + state to only update when value actually changes
  const prevIsPendingRef = useRef<boolean>(false);
  const [isTogglePending, setIsTogglePending] = useState(false);

  useEffect(
    function detectRelayStatusChange() {
      const currentIsPending = mutations.toggleRelay.isPending;
      // Only update state if value actually changed
      if (prevIsPendingRef.current !== currentIsPending) {
        prevIsPendingRef.current = currentIsPending;
        setIsTogglePending(currentIsPending);
      }
    },
    [mutations.toggleRelay.isPending],
  );

  const isLoading = useMemo(
    () => isLoadingSlotConfigurations || isLoadingStates,
    [isLoadingSlotConfigurations, isLoadingStates],
  );

  // ======================================================================== //
  // Memoized relay configurations - combines slotConfigurations with relayStates
  // relayStates from useStableRelayStates only updates when isOn values actually change
  // ======================================================================== //

  // Create a stable map of relay states by slotNumber for efficient lookup
  const relayStatesMap = useMemo(() => {
    if (!relayStates) return new Map<number, boolean>();
    return new Map(relayStates.map((state) => [state.slotNumber, state.isOn]));
  }, [relayStates]);

  // Memoize relayConfigs to prevent unnecessary re-renders
  // Only recalculates when slotConfigurations or relayStates actually change
  // relayStates from useStableRelayStates is already stable (only changes when isOn values change)
  const relayConfigs = useMemo<RelayConfig[]>(() => {
    if (!isSuccess || !slotConfigurations) return [];

    return slotConfigurations.map((slotConfiguration) => ({
      id: slotConfiguration.id,
      slotNumber: slotConfiguration.slotNumber,
      slotType: slotConfiguration.slotType,
      relayNumber: slotConfiguration.relayNumber,
      isActive: slotConfiguration.isActive,
      // Get isOn from relayStatesMap, default to false if not found
      isOn: relayStatesMap.get(slotConfiguration.slotNumber) ?? false,
    }));
  }, [slotConfigurations, isSuccess, relayStatesMap]);

  return (
    <AdminPageLayout
      title={'admin.pages.relays.title'}
      description={'admin.pages.relays.description'}
      isLoading={isLoading}
      styles={styles}
    >
      <AdminSection title="Connection Status" variant="border-solid">
        <RelaysConnectionStatus />
      </AdminSection>

      <AdminSection title="Relay Boards" variant="border-solid">
        <Flex justify="end" align="center" mt="-6" mb="2">
          <BulkRelayControls handlers={handlers} mutations={mutations} />
        </Flex>
        <Flex>
          <RelaysTable
            configurations={relayConfigs}
            onRelayToggle={handlers.relayToggle}
            isLoading={isTogglePending}
          />
        </Flex>
      </AdminSection>
    </AdminPageLayout>
  );
};
