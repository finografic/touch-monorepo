import React, { useEffect, useMemo, useRef } from 'react';

import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { RelayAssign } from 'admin/pages/AdminRelaysPage/RelayAssign';
import { RelayButtons } from 'admin/pages/AdminRelaysPage/RelayButtons';

import { useGetRelayStates, useInitializeRelay } from 'queries/relays';
import { useGetSlotConfigurations } from 'queries/slot-configurations';

import type { SlotType } from 'types/slots.types';
import { AdminPageLayout, AdminSection } from '../..';
import { NUM_RELAYS } from './relays.config';
import { RelaysStatus } from './RelaysStatus';
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
  const {
    data: slotConfigurations,
    isSuccess,
    isLoading: isLoadingSlotConfigurations,
  } = useGetSlotConfigurations();

  // Initialize relay service on mount
  const initializeRelayMutation = useInitializeRelay();
  useEffect(() => {
    initializeRelayMutation.mutate();
  }, []);

  // Use custom hook for all relay handlers
  const { handlers, mutations } = useRelayHandlers();

  // Note: useGetRelayStates is called in RelaysStatus component for status display
  // We only need it here to update isOn state in relayConfigs
  // React Query will deduplicate the calls automatically
  const { data: relayStates, isLoading: isLoadingStates } = useGetRelayStates();

  const isLoading = useMemo(
    () => isLoadingSlotConfigurations || isLoadingStates,
    [isLoadingSlotConfigurations, isLoadingStates],
  );

  // ======================================================================== //
  // Memoized relay configurations - combines slotConfigurations with relayStates
  // Only updates when slotConfigurations or relayStates isOn values actually change
  // ======================================================================== //

  // Use ref to track previous relayStates to detect actual isOn changes
  const prevRelayStatesRef = useRef<Map<number, boolean>>(new Map());
  const relayStatesMapRef = useRef<Map<number, boolean>>(new Map());

  // Only update relayStatesMap if isOn values actually changed
  const relayStatesMap = useMemo(() => {
    if (!relayStates) {
      // If no relayStates, return empty map but only update if we had states before
      if (prevRelayStatesRef.current.size === 0) {
        return relayStatesMapRef.current;
      }
      const newMap = new Map<number, boolean>();
      relayStatesMapRef.current = newMap;
      prevRelayStatesRef.current = newMap;
      return newMap;
    }

    // Create a map of current states
    const currentMap = new Map(relayStates.map((state) => [state.slotNumber, state.isOn]));

    // Compare with previous map to see if any isOn values changed
    let hasChanged = false;
    if (prevRelayStatesRef.current.size !== currentMap.size) {
      hasChanged = true;
    } else {
      for (const [slotNumber, isOn] of currentMap.entries()) {
        if (prevRelayStatesRef.current.get(slotNumber) !== isOn) {
          hasChanged = true;
          break;
        }
      }
    }

    // Only update if values actually changed
    if (hasChanged) {
      relayStatesMapRef.current = currentMap;
      prevRelayStatesRef.current = currentMap;
      return currentMap;
    }

    // Return previous map reference to maintain stability
    return relayStatesMapRef.current;
  }, [relayStates]);

  // Memoize relayConfigs to prevent unnecessary re-renders
  // Only recalculates when slotConfigurations or relayStatesMap reference changes
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

  // Show loading state while fetching slot configurations
  if (isLoading) {
    return (
      <AdminPageLayout title="Relay Control" isLoading={true} styles={styles}>
        <Box />
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Relay Control"
      description={`Test and control the ${NUM_RELAYS}-channel relay board`}
      styles={styles}
    >
      <AdminSection title="Connection Status" variant="border-solid">
        <RelaysStatus />
      </AdminSection>
      <Box className="admin-relay-control">
        <Flex direction="column" gap="6">
          <Flex direction="column" gap="4">
            <AdminSection title="Relay Boards" variant="border-solid">
              <Flex justify="end" align="center" mt="-6" mb="2">
                <RelayButtons handlers={handlers} mutations={mutations} />
              </Flex>
              <RelayAssign
                configurations={relayConfigs}
                onRelayToggle={handlers.relayToggle}
                isLoading={mutations.toggleRelay.isPending}
              />
            </AdminSection>
          </Flex>
        </Flex>
      </Box>
    </AdminPageLayout>
  );
};
