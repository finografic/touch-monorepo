import React, { useEffect, useState } from 'react';

import { Flex, Spinner, Text } from '@radix-ui/themes';
import { SelectAlt } from 'forms/SelectAlt';
import { SelectWithNew, type SelectWithNewResult } from 'forms/SelectWithNew';
import { useToast } from 'components/Toast';

import { useGetModes, useUpdateActiveStates } from 'queries/modes';

import { AdminPageLayout, AdminSection } from '../..';
import { styles } from './PublicModePage.styles';

// Mock data for testing SelectWithNew component
const MOCK_FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'mango', label: 'Mango' },
  { value: 'pineapple', label: 'Pineapple' },
];

export const AdminModePageDEV: React.FC = () => {
  const { toast } = useToast();
  const [activeModeIds, setActiveModeIds] = useState<string[]>([]);

  const { data: modes = [], isLoading: isLoadingModes } = useGetModes();
  const updateActiveStatesMutation = useUpdateActiveStates();

  // ======================================================================== //
  // TEST STATE FOR SelectWithNew COMPONENT
  // ======================================================================== //

  const [testSelected, setTestSelected] = useState<SelectWithNewResult | null>(null);
  const [mockOptions, setMockOptions] = useState(MOCK_FRUITS);

  // ======================================================================== //

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
      { activeModeIds: newActiveIds },
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

  // Handle SelectWithNew selection
  const handleSelectWithNew = (result: SelectWithNewResult) => {
    console.log('Selected:', result);
    setTestSelected(result);

    // If it's a new option, it's already added to the component's internal state
    // But we can also update our mock options if needed
    setMockOptions((prev) => {
      if (prev.some((opt) => opt.value === result.value)) {
        return prev; // Already exists
      }
      return [...prev, { value: result.value, label: result.label }];
    });
  };

  if (isLoadingModes) {
    return (
      <AdminPageLayout
        title="Mode Selection"
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
      title="Mode Selection - DEV"
      subtitle="Admin"
      description="Manage active modes for the system"
      styles={styles}
    >
      <AdminSection
        title="Active Mode Configuration - DEV"
        description="Select which modes should be active and available for use"
      >
        <Flex direction="column" gap="4" align="start">
          <Flex direction="column" gap="4" style={{ width: '100%', minWidth: '600px' }}>
            <Text size="3" weight="medium">
              Select Active Modes
            </Text>
            <Flex gap="8" style={{ width: '800px' }}>
              <Flex direction="column" gap="2" style={{ flex: 1 }}>
                {modes.map((mode) => {
                  const isActive = activeModeIds.includes(mode.id);
                  return (
                    <Flex
                      key={mode.id}
                      className={`mode-checkbox-item ${isActive ? 'selected' : ''}`}
                      onClick={() => handleMultiModeToggle(mode.id)}
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
              <Flex direction="column" gap="3" style={{ width: '100%', maxWidth: '400px' }}>
                <Text size="4" weight="bold">
                  SelectWithNew Component Test
                </Text>
                <Text size="2" color="gray">
                  Type a fruit name that doesn't exist to see the "Add new" option appear
                </Text>
                <Flex direction="column" gap="2">
                  <SelectWithNew
                    options={mockOptions}
                    value={testSelected?.value}
                    onSelect={handleSelectWithNew}
                    placeholder="Select or type a fruit..."
                    allowEmpty={true}
                    disabled={false}
                  />
                  {testSelected && (
                    <Flex
                      direction="column"
                      gap="1"
                      p="3"
                      style={{ backgroundColor: 'var(--gray-2)', borderRadius: '8px' }}
                    >
                      <Text size="2" weight="medium">
                        Selected:
                      </Text>
                      <Text size="2">
                        <strong>Value:</strong> {testSelected.value}
                      </Text>
                      <Text size="2">
                        <strong>Label:</strong> {testSelected.label}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </AdminSection>
    </AdminPageLayout>
  );
};
