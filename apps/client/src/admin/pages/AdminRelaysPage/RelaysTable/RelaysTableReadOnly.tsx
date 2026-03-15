import React, { useMemo } from 'react';
import { Col, Row } from '@finografic/design-system/grid';

import { Box, Flex } from 'styled-system/jsx';
import { getRelaySlotType } from 'admin/utils/relays.utils';
import clsx from 'clsx';

import { useStableRelayStates } from 'queries/relays';
import { useGetSlotConfigurations } from 'queries/slot-configurations';

import { getSlotColor } from 'utils/slots.utils';
import type { RelayConfig } from 'types/relays.types';
import type { SlotType } from 'types/slots.types';
import { NUM_RELAYS } from 'config/app/slots.config';
import { styles } from './RelaysTable.styles';

/**
 * Simplified read-only version of RelaysTable
 * - No timers
 * - No relay select dropdowns
 * - Shows only: slot number, type, relay assignment, and status
 */
export const RelaysTableReadOnly: React.FC = () => {
  const { data: slotConfigurations } = useGetSlotConfigurations();
  const { data: relayStates } = useStableRelayStates();

  // Create relay configurations with current relay states
  const relayConfigurations = useMemo<RelayConfig[]>(() => {
    if (!slotConfigurations) return [];

    // Create map of relay states by slotNumber
    const relayStatesMap = new Map<number, boolean>();
    if (relayStates) {
      relayStates.forEach((state) => {
        relayStatesMap.set(state.slotNumber, state.isOn);
      });
    }

    return slotConfigurations
      .filter((config) => config.slotNumber <= NUM_RELAYS)
      .sort((a, b) => a.slotNumber - b.slotNumber)
      .map((config) => ({
        id: config.id,
        slotNumber: config.slotNumber,
        slotType: config.slotType,
        relayNumber: config.relayNumber,
        isActive: config.isActive,
        isOn: relayStatesMap.get(config.slotNumber) ?? false,
      }));
  }, [slotConfigurations, relayStates]);

  const slotTypeMap = useMemo(() => {
    if (!slotConfigurations) return new Map<number, SlotType>();
    return new Map(slotConfigurations.map((config) => [config.slotNumber, config.slotType]));
  }, [slotConfigurations]);

  return (
    <Box css={styles}>
      <Flex justify="space-between" gap={4} width="100%">
        <Flex gap={4} width="100%">
          <div className="slot-list">
            {relayConfigurations.map((config) => {
              const configuredSlotType = slotTypeMap.get(config.slotNumber) || config.slotType;
              const isRelayActive = config.isOn;

              return (
                <div key={config.slotNumber} className={clsx('slot-grid-item')}>
                  <Row>
                    <Col xs={3} className="col col-square-type">
                      <Flex gap={4}>
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
                    <Col xs={9} className="col col-status">
                      <Flex
                        align="center"
                        gap={2}
                        ml={3}
                        className={clsx('relay-status', {
                          active: isRelayActive,
                        })}
                      >
                        {config.relayNumber ? (
                          <>
                            <Flex className="relay-status-indicator">{config.relayNumber}</Flex>
                            <Flex justify="end">Relay</Flex>
                            <Flex justify="center">{config.relayNumber}:</Flex>
                            <Flex>{isRelayActive ? 'ON' : 'OFF'}</Flex>
                          </>
                        ) : (
                          <>
                            <Flex className="relay-status-indicator status-off" />
                            <Flex />
                            <Flex />
                            <Flex>--</Flex>
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
