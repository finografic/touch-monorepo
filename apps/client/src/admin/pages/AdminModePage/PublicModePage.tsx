import React, { useEffect, useState } from 'react';

import { Flex, Spinner, Text } from '@radix-ui/themes';
import { useToast } from 'components/Toast';

import { useGetModes, useUpdateActiveStates } from 'queries/modes';

import { AdminPageLayout, AdminSection } from '../..';
import { styles } from './AdminModePage.styles';

export const PublicModePage: React.FC = () => {
  const { toast } = useToast();
  const [activeModeIds, setActiveModeIds] = useState<string[]>([]);

  const { data: modes = [], isLoading: isLoadingModes } = useGetModes();
  const updateActiveStatesMutation = useUpdateActiveStates();

  useEffect(() => {
    const activeModes = modes.filter((mode) => mode.isActive);
    setActiveModeIds(activeModes.map((mode) => mode.id));
  }, [modes]);

  const handleModeToggle = (modeId: string) => {
    const isCurrentlyActive = activeModeIds.includes(modeId);
    const newActiveIds = isCurrentlyActive
      ? activeModeIds.filter((id) => id !== modeId)
      : [...activeModeIds, modeId];

    setActiveModeIds(newActiveIds);

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

  if (isLoadingModes) {
    return (
      <AdminPageLayout
        title="Mode Selection - USER"
        description="Manage active modes for the system"
        styles={styles}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading available modes...</Text>
        </Flex>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Mode Selection - XXX"
      subtitle="Admin"
      description="Manage active modes for the system"
      styles={styles}
    >
      <AdminSection
        title="Active Mode Configuration - ADMIN"
        description="Select which modes should be active and available for use"
      >
        <Flex direction="column" gap="4" align="start">
          <Flex direction="column" gap="3" style={{ width: '100%', maxWidth: '500px' }}>
            <Text size="3" weight="medium">
              Select Active Modes
            </Text>
            <Flex direction="column" gap="2">
              {modes.map((mode) => {
                const isActive = activeModeIds.includes(mode.id);
                return (
                  <Flex
                    key={mode.id}
                    className={`mode-checkbox-item ${isActive ? 'selected' : ''}`}
                    onClick={() => handleModeToggle(mode.id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid',
                      cursor: 'pointer',
                      backgroundColor: isActive ? 'var(--accent-3)' : 'white',
                      borderColor: isActive ? 'var(--accent-9)' : 'var(--gray-6)',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <Flex align="center" gap="3">
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          border: '2px solid',
                          borderColor: isActive ? 'var(--accent-9)' : 'var(--gray-8)',
                          backgroundColor: isActive ? 'var(--accent-9)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isActive && (
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: 'white',
                            }}
                          />
                        )}
                      </div>
                      <Text size="2" weight={isActive ? 'medium' : 'regular'}>
                        {mode.name}
                      </Text>
                    </Flex>
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        </Flex>
      </AdminSection>
    </AdminPageLayout>
  );
};
