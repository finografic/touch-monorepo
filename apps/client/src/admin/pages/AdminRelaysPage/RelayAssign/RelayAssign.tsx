import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Row } from 'react-grid-system';

import { Box, Flex, Text } from '@radix-ui/themes';
import { getRelaySlotType } from 'admin/utils/relays.utils';
import clsx from 'clsx';
import { SelectCustom } from 'forms/SelectCustom';
import { Button } from 'components/Button';

import { useGetRelayStatus } from 'queries/relays';
import { useBulkUpdateSlotConfigurations } from 'queries/slot-configurations';

import { getSlotColor } from 'utils/slots.utils';
import type { SelectOption } from 'types/models/select-option.model';
import { RELAY_SLOT_COLORS, type RelayConfig } from 'types/relays.types';
import type { SlotType } from 'types/slots.types';
import { SlotSpecial } from 'types/slots.types';
import { NUM_RELAYS } from '../relays.config';
import { AdminSlotTimer } from './AdminSlotTimer';
import { RelaySelectWithButton } from './RelaySelectWithButton';
import { useColors } from 'styles';
import { RadioIcon } from 'styles/icons';
import { styles } from './RelayAssign.styles';

interface RelayAssignProps {
  configurations: RelayConfig[];
  onRelayToggle?: (slotNumber: number, newState: boolean) => void;
  isLoading?: boolean;
  isForceTestEnabled?: boolean;
}

// Map: rowNumber (1-16) -> selectedValue (1-16 | undefined)
type Assignments = Record<number, number | undefined>;

export const RelayAssign: React.FC<RelayAssignProps> = ({
  configurations,
  onRelayToggle,
  isLoading = false,
  isForceTestEnabled = false,
}) => {
  const bulkUpdateMutation = useBulkUpdateSlotConfigurations();

  // Get connection status to determine if test buttons should be enabled
  const { data: relayStatus } = useGetRelayStatus();
  const isConnected = relayStatus?.connected ?? false;

  // Test buttons are enabled if: connected OR isForceTestEnabled is true
  const canTest = isConnected || isForceTestEnabled;

  const relayConfigurations = useMemo(() => {
    return configurations
      .filter((config) => config.slotNumber <= NUM_RELAYS)
      .sort((a, b) => a.slotNumber - b.slotNumber);
  }, [configurations]);

  const slotTypeMap = useMemo(() => {
    if (!configurations) return new Map<number, SlotType>();
    return new Map(configurations.map((config) => [config.slotNumber, config.slotType]));
  }, [configurations]);

  // Each slot has a unique relay assignment (1-16 or undefined)
  // Null values from DB are converted to undefined for UI state
  // Memoize relayNumber map to prevent unnecessary updates when only isOn changes
  const relayNumberMap = useMemo(() => {
    const map = new Map<number, number | undefined>();
    configurations
      .filter((config) => config.slotNumber <= NUM_RELAYS)
      .forEach((config) => {
        map.set(config.slotNumber, config.relayNumber ?? undefined);
      });
    return map;
  }, [configurations]);

  // Initialize assignments with ALL slot numbers (1-16), even if unset
  // This ensures all slots are always present in the object
  const [assignments, setAssignments] = useState<Assignments>(() => {
    const initial: Assignments = {};
    // Initialize all slots from 1 to NUM_RELAYS
    for (let slotNumber = 1; slotNumber <= NUM_RELAYS; slotNumber++) {
      // Get value from relayNumberMap if it exists, otherwise undefined
      initial[slotNumber] = relayNumberMap.get(slotNumber) ?? undefined;
    }
    return initial;
  });

  // Use ref to track previous relayNumberMap to detect actual changes
  const prevRelayNumberMapRef = useRef<Map<number, number | undefined>>(relayNumberMap);

  useEffect(
    function synchronizeAssignments() {
      // Only update if relayNumber values actually changed (not just isOn)
      const hasChanged = Array.from(relayNumberMap.entries()).some(
        ([slotNumber, relayNumber]) => prevRelayNumberMapRef.current.get(slotNumber) !== relayNumber,
      );

      if (hasChanged) {
        const initial: Assignments = {};
        // Initialize all slots from 1 to NUM_RELAYS to ensure all slots are present
        for (let slotNumber = 1; slotNumber <= NUM_RELAYS; slotNumber++) {
          initial[slotNumber] = relayNumberMap.get(slotNumber) ?? undefined;
        }
        setAssignments(initial);
        prevRelayNumberMapRef.current = relayNumberMap;
      }
    },
    [relayNumberMap],
  );

  const baseOptions: SelectOption[] = useMemo(() => {
    return Array.from({ length: NUM_RELAYS }, (_, index) => {
      const value = index + 1;
      return { value: value.toString(), label: `Relay ${value}` };
    });
  }, []);

  const updateAllConfigurations = useCallback(
    (newAssignments: Assignments) => {
      const updatedConfigs = configurations.map((config) => {
        // Check if slot is in newAssignments (even if value is undefined)
        const hasAssignment = config.slotNumber in newAssignments;
        const assignment = newAssignments[config.slotNumber];

        if (hasAssignment) {
          // Convert undefined back to null for DB
          return {
            slotNumber: config.slotNumber,
            slotType: config.slotType,
            isActive: config.isActive, // Preserve existing isActive
            relayNumber: assignment ?? null,
          };
        }

        return {
          slotNumber: config.slotNumber,
          slotType: config.slotType,
          isActive: config.isActive, // Preserve existing isActive
          relayNumber: config.relayNumber,
        };
      });

      bulkUpdateMutation.mutate({
        configurations: updatedConfigs,
      });
    },
    [configurations, bulkUpdateMutation],
  );

  const handleSelectChange = useCallback(
    (slotNumber: number, selectedValue: string) => {
      const relayValue = selectedValue ? Number(selectedValue) : undefined;
      const config = relayConfigurations.find((c) => c.slotNumber === slotNumber);
      if (!config) return;

      setAssignments((prev) => {
        const currentAssignment = prev[slotNumber];

        // Deselect if empty or clicking the same value (toggle behavior)
        if (!selectedValue || currentAssignment === relayValue) {
          const updated = { ...prev, [slotNumber]: undefined };
          updateAllConfigurations(updated);
          return updated;
        }

        // Find any conflicting slot that already has this relay assigned
        const conflictingSlotNumber = Object.keys(prev).find(
          (key) => Number(key) !== slotNumber && prev[Number(key)] === relayValue,
        );

        const updated: Assignments = { ...prev };

        // Swap: clear the conflict and assign to current slot
        if (conflictingSlotNumber) {
          updated[Number(conflictingSlotNumber)] = undefined;
        }
        updated[slotNumber] = relayValue;

        updateAllConfigurations(updated);
        return updated;
      });
    },
    [relayConfigurations, updateAllConfigurations],
  );

  const colors = useColors();

  const handleSlotClick = useCallback(
    (slotNumber: number) => {
      const currentConfig = relayConfigurations.find((config) => config.slotNumber === slotNumber);
      // Can only toggle if relay is assigned
      if (!currentConfig || !currentConfig.relayNumber) return;

      const newIsOn = !currentConfig.isOn;
      onRelayToggle?.(currentConfig.relayNumber, newIsOn);
    },
    [onRelayToggle, relayConfigurations],
  );

  const handleClickTest = (relayNumber: number | null) => {
    if (!relayNumber) return;

    log('[RELAY TEST]:', 'lime', relayNumber);
  };

  return (
    <Box css={styles}>
      <Flex justify="between" gap="4" width="100%">
        <Flex gap="4" width="100%">
          <div className="slot-list">
            {/* TODO: ORDER BY *SLOT NUMBER* */}
            {relayConfigurations.map((config) => {
              const configuredSlotType = slotTypeMap.get(config.slotNumber) || config.slotType;

              return (
                <div key={config.slotNumber} className={clsx('slot-grid-item', { 'is-loading': isLoading })}>
                  <Row>
                    <Col xs={2} className="col col-square-type">
                      <Flex gap="4">
                        <Flex
                          className="slot-square"
                          style={{
                            borderColor: getSlotColor(config),
                            color: getSlotColor(config),
                          }}
                        >
                          {config.slotNumber}
                        </Flex>
                        <Flex className="col col-type" style={{ color: getSlotColor(config) }}>
                          {getRelaySlotType(config, relayConfigurations)}
                        </Flex>
                      </Flex>
                    </Col>
                    <Col xs={2} className="col col-timer">
                      <Flex>
                        <AdminSlotTimer slotNumber={config.slotNumber} />
                      </Flex>
                    </Col>
                    <Col xs={4} className="col col-select">
                      <Flex gap="6">
                        <Flex width="220px">
                          <SelectCustom
                            className="relay-assign-select"
                            options={baseOptions}
                            placeholder="Please select..."
                            value={assignments[config.slotNumber]?.toString() || undefined}
                            onSelect={(value) => handleSelectChange(config.slotNumber, value)}
                            disabled={isLoading || bulkUpdateMutation.isPending}
                            allowEmpty={true}
                          />
                        </Flex>
                        <Flex>
                          {assignments[config.slotNumber] ? (
                            <Button
                              className="button-relay-test"
                              onClick={() => handleClickTest(config.relayNumber)}
                              variant="solid"
                              color="info"
                              size="sm"
                              disabled={!canTest}
                            >
                              <RadioIcon /> test
                            </Button>
                          ) : (
                            <Flex align="center" gap="2" ml="3" className="status-off">
                              <Text color="gray" size="2">
                                {/* No relay assigned */}
                              </Text>
                            </Flex>
                          )}
                        </Flex>
                      </Flex>
                    </Col>
                    <Col xs={4} className="col col-status">
                      <Flex
                        align="center"
                        gap="2"
                        ml="3"
                        className={`relay-status ${config.isOn ? 'status-on' : 'status-off'}`}
                      >
                        {assignments[config.slotNumber] ? (
                          <>
                            <Flex className="relay-status-indicator">{assignments[config.slotNumber]}</Flex>
                            <Flex justify="end">Relay</Flex>
                            <Flex justify="center">{assignments[config.slotNumber]}:</Flex>
                            <Flex>{config.isOn ? 'ON' : 'OFF'}</Flex>
                          </>
                        ) : (
                          <>
                            <Flex className="relay-status-indicator status-off" />
                            <Flex />
                            <Flex />
                            <Flex />
                          </>
                        )}
                      </Flex>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
        </Flex>
      </Flex>
    </Box>
  );
};
