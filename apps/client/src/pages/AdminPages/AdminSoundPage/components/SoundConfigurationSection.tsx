import React, { useCallback } from 'react';
import { Box, Button, Flex, Heading, Select, Text } from '@radix-ui/themes';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
import { useToast } from 'components/Toast';
import { type SoundFile, type SoundSettings, useUpdateSoundSettings } from 'api/hooks/useSounds';
import { playSoundByPath } from 'utils/soundCache.utils';
import { styles } from './SoundConfigurationSection.styles';

interface SoundConfigurationSectionProps {
  soundFiles: SoundFile[];
  soundSettings: SoundSettings;
}

export const SoundConfigurationSection: React.FC<SoundConfigurationSectionProps> = ({
  soundFiles,
  soundSettings,
}) => {
  const { toast } = useToast();
  const updateSettingsMutation = useUpdateSoundSettings();

  // Handle sound selection
  const handleSoundSelection = useCallback(
    async (soundType: 'tick' | 'finish', fileId: string | null) => {
      try {
        const newSettings = {
          ...soundSettings,
          [soundType]: fileId,
        };

        await updateSettingsMutation.mutateAsync(newSettings);

        const selectedFile = soundFiles.find((file) => file.id === fileId);
        if (selectedFile) {
          toast({
            variant: 'success',
            message: `${soundType} sound updated`,
            subText: `Now using: ${selectedFile.name}`,
          });
        }
      } catch (error) {
        toast({
          variant: 'error',
          message: 'Failed to update sound settings',
          subText: 'Please try again',
        });
      }
    },
    [soundSettings, soundFiles, updateSettingsMutation, toast],
  );

  // Test sound playback using file path
  const testSound = useCallback(
    async (fileId: string) => {
      try {
        const soundFile = soundFiles.find((file) => file.id === fileId);
        if (!soundFile || !soundFile.filePath) {
          throw new Error('Sound file not found or missing file path');
        }

        await playSoundByPath(soundFile.filePath, 0.3);
        toast({
          variant: 'success',
          message: 'Sound played successfully',
          subText: 'Check your audio settings if you cannot hear it',
        });
      } catch (error) {
        console.error('Error playing sound:', error);
        toast({
          variant: 'error',
          message: 'Could not play sound',
          subText: 'Check browser permissions or try again',
        });
      }
    },
    [soundFiles, toast],
  );

  return (
    <div css={styles} className="sound-configuration-section">
      <Flex direction="column" gap="3">
        <Heading size="3">Timer Event Sounds</Heading>

        <Flex gap="4" align="center" className="sound-config-row">
          <Box className="sound-label">
            <Text weight="bold">Tick Sound:</Text>
          </Box>
          <Box className="sound-select-container">
            <Select.Root
              value={soundSettings.tick || 'none'}
              onValueChange={(value) => handleSoundSelection('tick', value === 'none' ? null : value)}
              disabled={updateSettingsMutation.isPending}
            >
              <Select.Trigger placeholder="Select tick sound..." />
              <Select.Content>
                <Select.Item value="none">None</Select.Item>
                {soundFiles.map((file) => (
                  <Select.Item key={file.id} value={file.id}>
                    {file.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>
          {soundSettings.tick && (
            <Button
              size="1"
              variant="soft"
              onClick={() => testSound(soundSettings.tick!)}
              className="test-button"
            >
              <SpeakerLoudIcon />
              Test
            </Button>
          )}
        </Flex>

        <Flex gap="4" align="center" className="sound-config-row">
          <Box className="sound-label">
            <Text weight="bold">Finish Sound:</Text>
          </Box>
          <Box className="sound-select-container">
            <Select.Root
              value={soundSettings.finish || 'none'}
              onValueChange={(value) => handleSoundSelection('finish', value === 'none' ? null : value)}
              disabled={updateSettingsMutation.isPending}
            >
              <Select.Trigger placeholder="Select finish sound..." />
              <Select.Content>
                <Select.Item value="none">None</Select.Item>
                {soundFiles.map((file) => (
                  <Select.Item key={file.id} value={file.id}>
                    {file.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>
          {soundSettings.finish && (
            <Button
              size="1"
              variant="soft"
              onClick={() => testSound(soundSettings.finish!)}
              className="test-button"
            >
              <SpeakerLoudIcon />
              Test
            </Button>
          )}
        </Flex>
      </Flex>
    </div>
  );
};
