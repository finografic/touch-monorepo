import React, { useEffect } from 'react';
import { Button, Flex, Spinner, Text } from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../shared';
import { styles } from './AdminSoundPage.styles';
import { useGetSoundFiles, useGetSoundSettings } from 'api/hooks/useSounds';
import { FileUploadSection, SoundConfigurationSection, SoundLibrarySection } from './components';
import { preloadSounds, testAudioPlayback, updateCachedSoundFiles } from 'utils/soundCache.utils';
import { useToast } from 'components/Toast';

export const AdminSoundBasicPage: React.FC = () => {
  const { toast } = useToast();

  // API hooks
  const { data: soundFiles = [], isLoading: isLoadingFiles } = useGetSoundFiles();
  const { data: soundSettings = { tick: null, finish: null }, isLoading: isLoadingSettings } =
    useGetSoundSettings();

  // Preload sounds when files are loaded
  useEffect(() => {
    if (soundFiles.length > 0) {
      // Update cached sound files list
      updateCachedSoundFiles(soundFiles);

      // Preload all sounds
      preloadSounds(soundFiles).catch((error) => {
        console.warn('Failed to preload some sounds:', error);
      });
    }
  }, [soundFiles]);

  // Test basic audio playback
  const handleTestAudio = async () => {
    try {
      await testAudioPlayback();
      toast({
        variant: 'success',
        message: 'Basic audio test passed!',
        subText: 'Audio playback is working correctly',
      });
    } catch (error) {
      toast({
        variant: 'error',
        message: 'Basic audio test failed',
        subText: 'Check browser console for details',
      });
    }
  };

  if (isLoadingFiles || isLoadingSettings) {
    return (
      <section css={styles} className="admin-content-page">
        <AdminContentLayout
          title="Sound Management (BASIC)"
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

  log('__DEV: soundFiles', 'orange', soundFiles);

  return (
    <section css={styles} className="admin-content-page">
      <AdminContentLayout
        title="Sound Management (BASIC)"
        subtitle="Upload and configure sound files for timer events"
      >
        {/* Sound Settings Section */}
        <AdminSection
          title="Sound Configuration"
          description="Select which sound files to use for timer events"
          variant="border-solid"
        >
          <SoundConfigurationSection soundFiles={soundFiles} soundSettings={soundSettings} />
        </AdminSection>

        {/* File Upload Section */}
        <AdminSection
          title="Upload Sound Files"
          description="Add new sound files to your library (MP3, WAV, AIFF supported - AIFF/WAV files are automatically converted to MP3 for optimal web compatibility and smaller file sizes)"
          variant="border-solid"
        >
          <FileUploadSection />
        </AdminSection>

        {/* File Library Section */}
        <AdminSection
          title="Sound Library"
          description={`${soundFiles.length} sound file(s) available`}
          variant="border-solid"
        >
          <SoundLibrarySection soundFiles={soundFiles} soundSettings={soundSettings} />
        </AdminSection>
      </AdminContentLayout>
    </section>
  );
};
