import React, { useEffect, useState } from 'react';

import { Flex, Text } from '@radix-ui/themes';
import { useToast } from 'components/Toast';

import { useGetModes, useUpdateActiveStates } from 'queries/modes';

import { AdminPageLayout, AdminSection } from '../..';
import { styles } from './AdminModePage.styles';

export const AdminModePage: React.FC = () => {
  const { toast } = useToast();
  const [activeModeIds, setActiveModeIds] = useState<string[]>([]);

  const { data: modes = [], isLoading: isLoadingModes } = useGetModes();
  const updateActiveStatesMutation = useUpdateActiveStates();

  // Load active modes from database on component mount
  useEffect(() => {
    const activeModes = modes.filter((mode) => mode.isActive);
    setActiveModeIds(activeModes.map((mode) => mode.id));
  }, [modes]);

  // Handle mode toggle (multi-select)
  const handleMultiModeToggle = (modeId: string) => {
    const isCurrentlyActive = activeModeIds.includes(modeId);
    const newActiveIds = isCurrentlyActive
      ? activeModeIds.filter((id) => id !== modeId)
      : [...activeModeIds, modeId];

    // Update local state immediately for responsive UI
    setActiveModeIds(newActiveIds);

    // Update database
    updateActiveStatesMutation.mutate(
      { modes: newActiveIds.map((id) => ({ id, isActive: true })) },
      {
        onSuccess: () => {
          console.log('Active modes updated!', {
            variant: 'success',
            message: 'Active modes updated!',
            subText: `${newActiveIds.length} mode(s) are now active`,
          });
        },
        onError: () => {
          // Revert on error
          setActiveModeIds(activeModeIds);
          toast({
            variant: 'error',
            message: 'Failed to update active modes',
            subText: 'Please try again',
          });
        },
      },
    );
  };

  // if (isLoadingModes) {
  //   return (
  //     <AdminPageLayout
  //       title="Mode Selection"
  //       description="Manage active modes for the system"
  //       styles={styles}
  //     >
  //       <Flex direction="column" gap="4" align="center" justify="center" p="6">
  //         <Spinner size="3" />
  //         <Text>Loading available modes...</Text>
  //       </Flex>
  //     </AdminPageLayout>
  //   );
  // }

  return (
    <AdminPageLayout
      title="Available Modes"
      description="Manage active modes for the system"
      isLoading={isLoadingModes}
      styles={styles}
    >
      <AdminSection>
        <Flex direction="column" gap="4" align="start">
          <Flex direction="column" gap="4" className="modes-container">
            <Text size="3" weight="medium">
              Select Active Modes
            </Text>
            <Flex gap="8" className="modes-flex-container">
              <Flex direction="column" gap="2" className="modes-column">
                {modes.map((mode) => {
                  const isActive = activeModeIds.includes(mode.id);
                  return (
                    <Flex
                      key={mode.id}
                      className={`mode-checkbox-item ${isActive ? 'selected' : ''}`}
                      onClick={() => handleMultiModeToggle(mode.id)}
                    >
                      <Flex align="center" gap="3">
                        <div className="mode-checkbox-item-icon">
                          {isActive && <div className="mode-checkbox-item-checkmark" />}
                        </div>
                        <Text size="2" weight={isActive ? 'medium' : 'regular'}>
                          {mode.name}
                        </Text>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
              <Flex direction="column" gap="3" className="modes-right-column">
                <Flex direction="column" gap="2">
                  {/* TODO: TEST NEW COMPONENT HERE */}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </AdminSection>
    </AdminPageLayout>
  );
};
