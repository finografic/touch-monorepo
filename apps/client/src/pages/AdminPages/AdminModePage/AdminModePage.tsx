import React, { useEffect, useState } from 'react';
import { Button, Flex, Spinner, Text } from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../shared';
import { styles } from './AdminModePage.styles';
import { useGetModes } from 'queries/modes';
import { useToast } from 'components/Toast';

// Storage key for default mode
const DEFAULT_MODE_STORAGE_KEY = 'touch-monorepo.default-mode';

export const AdminModePage: React.FC = () => {
  const { toast } = useToast();
  const [selectedModeId, setSelectedModeId] = useState<string>('');

  // API hooks
  const { data: modes = [], isLoading: isLoadingModes } = useGetModes();

  // Load saved default mode on component mount
  useEffect(() => {
    const savedModeId = localStorage.getItem(DEFAULT_MODE_STORAGE_KEY);
    if (savedModeId) {
      setSelectedModeId(savedModeId);
    }
  }, []);

  // Handle mode selection
  const handleModeSelect = (modeId: string) => {
    setSelectedModeId(modeId);

    // Save to localStorage
    localStorage.setItem(DEFAULT_MODE_STORAGE_KEY, modeId);

    // Find the selected mode name for toast
    const selectedMode = modes.find((mode) => mode.id === modeId);

    // TODO: DEBOUNCE ??

    // toast({
    //   variant: 'success',
    //   message: 'Default mode updated!',
    //   subText: `Default mode set to: ${selectedMode?.name || 'Unknown'}`,
    // });
  };

  // Clear default mode
  const handleClearMode = () => {
    setSelectedModeId('');
    localStorage.removeItem(DEFAULT_MODE_STORAGE_KEY);

    toast({
      variant: 'info',
      message: 'Default mode cleared',
      subText: 'No default mode is currently set',
    });
  };

  if (isLoadingModes) {
    return (
      <section css={styles} className="admin-content-page">
        <AdminContentLayout title="Mode Selection" description="Select default mode for the system">
          <Flex direction="column" gap="4" align="center" justify="center" p="6">
            <Spinner size="3" />
            <Text>Loading available modes...</Text>
          </Flex>
        </AdminContentLayout>
      </section>
    );
  }

  return (
    <section css={styles} className="admin-content-page">
      <AdminContentLayout
        title="Mode Selection"
        subtitle="Admin"
        description="Select default mode for the system"
      >
        <AdminSection
          title="Default Mode Configuration"
          description="Choose the default mode that will be used when no specific mode is selected"
        >
          <Flex direction="column" gap="4" align="start">
            <Flex direction="column" gap="3" style={{ width: '100%', maxWidth: '500px' }}>
              <Text size="3" weight="medium">
                Select Default Mode
              </Text>
              <Flex direction="column" gap="2">
                {modes.map((mode) => (
                  <Flex
                    key={mode.id}
                    className={`mode-checkbox-item ${selectedModeId === mode.id ? 'selected' : ''}`}
                    onClick={() => handleModeSelect(mode.id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid',
                      cursor: 'pointer',
                      backgroundColor: selectedModeId === mode.id ? 'var(--accent-3)' : 'white',
                      borderColor: selectedModeId === mode.id ? 'var(--accent-9)' : 'var(--gray-6)',
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
                          borderColor: selectedModeId === mode.id ? 'var(--accent-9)' : 'var(--gray-8)',
                          backgroundColor: selectedModeId === mode.id ? 'var(--accent-9)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {selectedModeId === mode.id && (
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
                      <Text size="2" weight={selectedModeId === mode.id ? 'medium' : 'regular'}>
                        {mode.name}
                      </Text>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Flex>

            <Flex direction="column" gap="2">
              {selectedModeId ? (
                <Text size="2" color="gray">
                  Current default mode:{' '}
                  <Text weight="bold">{modes.find((m) => m.id === selectedModeId)?.name}</Text>
                </Text>
              ) : (
                <Text size="2" color="gray">
                  No default mode is currently set
                </Text>
              )}
            </Flex>
          </Flex>
        </AdminSection>
      </AdminContentLayout>
    </section>
  );
};
