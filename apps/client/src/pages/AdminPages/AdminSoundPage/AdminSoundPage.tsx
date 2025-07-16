import React, { useCallback, useRef, useState } from 'react';
import { Box, Button, Callout, Card, Flex, Heading, Select, Spinner, Text } from '@radix-ui/themes';
import { CheckIcon, SpeakerLoudIcon, UploadIcon } from '@radix-ui/react-icons';
import { AdminContentLayout, AdminSection } from '../shared';
import { styles } from './AdminSoundPage.styles';
import { useToast } from 'components/Toast';
import {
  type SoundFile,
  type SoundSettings,
  useGetSoundFiles,
  useGetSoundSettings,
  useRemoveSoundFile,
  useUpdateSoundSettings,
  useUploadSoundFiles,
} from 'api/hooks/useSounds';

export const AdminSoundPage: React.FC = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { data: soundFiles = [], isLoading: isLoadingFiles } = useGetSoundFiles();
  const { data: soundSettings = { tick: null, finish: null }, isLoading: isLoadingSettings } =
    useGetSoundSettings();
  const uploadMutation = useUploadSoundFiles();
  const removeMutation = useRemoveSoundFile();
  const updateSettingsMutation = useUpdateSoundSettings();

  // Handle file upload
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);

      try {
        await uploadMutation.mutateAsync(Array.from(files));
        toast({
          variant: 'success',
          message: 'Files uploaded successfully!',
          subText: `${files.length} file(s) added to your sound library`,
        });
      } catch (error) {
        toast({
          variant: 'error',
          message: 'Upload failed',
          subText: 'Please try again with valid audio files',
        });
      } finally {
        setIsUploading(false);
        // Reset the input
        event.target.value = '';
      }
    },
    [uploadMutation, toast],
  );

  // Handle file upload button click
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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

  // Test sound playback
  const testSound = useCallback(
    (fileId: string) => {
      const file = soundFiles.find((f) => f.id === fileId);
      if (file) {
        const audio = new Audio(file.url);
        audio.volume = 0.3;
        audio.play().catch((error) => {
          console.error('Error playing sound:', error);
          toast({
            variant: 'error',
            message: 'Could not play sound',
            subText: 'Check browser permissions',
          });
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

  if (isLoadingFiles || isLoadingSettings) {
    return (
      <section css={styles} className="admin-content-page">
        <AdminContentLayout
          title="Sound Management"
          subtitle="Upload and configure sound files for timer events"
        >
          <Flex direction="column" gap="4" align="center" justify="center" p="6">
            <Spinner size="3" />
            <Text>Loading sound settings...</Text>
          </Flex>
        </AdminContentLayout>
      </section>
    );
  }

  return (
    <section css={styles} className="admin-content-page">
      <AdminContentLayout
        title="Sound Management"
        subtitle="Upload and configure sound files for timer events"
      >
        {/* Sound Settings Section */}
        <AdminSection
          title="Sound Configuration"
          description="Select which sound files to use for timer events"
        >
          <Flex direction="column" gap="4">
            <Card size="2" style={{ padding: '1rem' }}>
              <Flex direction="column" gap="3">
                <Heading size="3">Timer Event Sounds</Heading>

                <Flex gap="4" align="center">
                  <Box style={{ minWidth: '120px' }}>
                    <Text weight="bold">Tick Sound:</Text>
                  </Box>
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
                  {soundSettings.tick && (
                    <Button size="1" variant="soft" onClick={() => testSound(soundSettings.tick!)}>
                      <SpeakerLoudIcon />
                      Test
                    </Button>
                  )}
                </Flex>

                <Flex gap="4" align="center">
                  <Box style={{ minWidth: '120px' }}>
                    <Text weight="bold">Finish Sound:</Text>
                  </Box>
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
                  {soundSettings.finish && (
                    <Button size="1" variant="soft" onClick={() => testSound(soundSettings.finish!)}>
                      <SpeakerLoudIcon />
                      Test
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Card>
          </Flex>
        </AdminSection>

        {/* File Upload Section */}
        <AdminSection
          title="Upload Sound Files"
          description="Add new sound files to your library (MP3, WAV, AIFF supported)"
        >
          <Card size="2" style={{ padding: '1rem' }}>
            <Flex direction="column" gap="3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="audio/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={isUploading || uploadMutation.isPending}
              />
              <Button
                size="3"
                variant="soft"
                disabled={isUploading || uploadMutation.isPending}
                onClick={handleUploadClick}
              >
                <UploadIcon />
                {isUploading || uploadMutation.isPending ? 'Uploading...' : 'Choose Sound Files'}
              </Button>

              <Text size="2" color="gray">
                Supported formats: MP3, WAV, AIFF. Max file size: 10MB per file.
              </Text>
            </Flex>
          </Card>
        </AdminSection>

        {/* File Library Section */}
        <AdminSection title="Sound Library" description={`${soundFiles.length} sound file(s) available`}>
          {soundFiles.length === 0 ? (
            <Callout.Root color="blue">
              <Callout.Text>No sound files uploaded yet. Upload some files to get started!</Callout.Text>
            </Callout.Root>
          ) : (
            <Flex direction="column" gap="2">
              {soundFiles.map((file) => (
                <Card key={file.id} size="2" style={{ padding: '0.75rem' }}>
                  <Flex justify="between" align="center">
                    <Flex direction="column" gap="1" style={{ flex: 1 }}>
                      <Flex align="center" gap="2">
                        <Text weight="bold">{file.name}</Text>
                        {(soundSettings.tick === file.id || soundSettings.finish === file.id) && (
                          <CheckIcon color="green" />
                        )}
                      </Flex>
                      <Text size="1" color="gray">
                        {formatFileSize(file.size)} • {file.type} •{' '}
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </Text>
                    </Flex>

                    <Flex gap="2">
                      <Button size="1" variant="soft" onClick={() => testSound(file.id)}>
                        <SpeakerLoudIcon />
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
                </Card>
              ))}
            </Flex>
          )}
        </AdminSection>
      </AdminContentLayout>
    </section>
  );
};
