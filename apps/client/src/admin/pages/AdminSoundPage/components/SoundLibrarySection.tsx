import React, { useCallback } from 'react';

import { Button, Callout, Flex, Text } from '@radix-ui/themes';

import { useToast } from 'components/Toast';
import { useRemoveSoundFile } from 'queries/sounds';
// import { CheckIcon, SpeakerLoudIcon } from '@radix-ui/react-icons';
import { BadgeCheckIcon, SpeakerLoudIcon } from 'styles/icons';
import type { SoundFile, SoundSettings, SoundType } from 'types/sounds.types';
import { playSoundByPath } from 'utils/soundCache.utils';

interface SoundLibrarySectionProps {
  soundFiles: SoundFile[];
  soundSettings: SoundSettings;
  soundType: SoundType;
}

export const SoundLibrarySection: React.FC<SoundLibrarySectionProps> = ({
  soundFiles,
  soundSettings,
  soundType,
}) => {
  const { toast } = useToast();
  const removeMutation = useRemoveSoundFile(soundType);

  // Test sound playback using file path
  const testSound = useCallback(
    async (fileId: string) => {
      try {
        const soundFile = soundFiles.find((file) => file.id === fileId);
        if (!soundFile || !soundFile.filePath) {
          throw new Error('Sound file not found or missing file path');
        }

        await playSoundByPath(soundFile.filePath);
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

  // Remove file
  const removeFile = useCallback(
    async (fileId: string) => {
      try {
        await removeMutation.mutateAsync(fileId);
        toast({
          variant: 'success',
          message: 'File removed',
          subText: 'Sound file deleted from library',
        });
      } catch (error) {
        toast({
          variant: 'error',
          message: 'Failed to remove file',
          subText: 'Please try again',
        });
      }
    },
    [removeMutation, toast],
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <>
      {soundFiles.length === 0 ? (
        <Callout.Root color="blue">
          <Callout.Text>No sound files uploaded yet. Upload some files to get started!</Callout.Text>
        </Callout.Root>
      ) : (
        <Flex direction="column" gap="2" className="sound-library-list">
          {soundFiles.map((file) => (
            <div
              className="sound-library-item"
              key={file.id}
              style={{
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: 'white',
              }}
            >
              <Flex justify="between" align="center" gap="3">
                {/* Checkmark Column - Fixed Width */}
                <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                  {soundSettings[soundType] === file.id && <BadgeCheckIcon className="icon-check" />}
                </div>

                {/* Content Column - Takes remaining space */}
                <Flex direction="column" gap="1" style={{ flex: 1 }}>
                  <Text weight="bold">{file.name}</Text>
                  <Text size="1" color="gray">
                    {formatFileSize(file.size)} • {file.type} •{' '}
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </Text>
                </Flex>

                <Flex gap="2">
                  <Button size="1" variant="soft" onClick={() => testSound(file.id)}>
                    <SpeakerLoudIcon className="icon-speaker" />
                    Test
                  </Button>
                  <Button
                    size="1"
                    variant="soft"
                    color="red"
                    onClick={() => removeFile(file.id)}
                    disabled={removeMutation.isPending}
                  >
                    {removeMutation.isPending ? 'Removing...' : 'Remove'}
                  </Button>
                </Flex>
              </Flex>
            </div>
          ))}
        </Flex>
      )}
    </>
  );
};
