import React, { useEffect, useState } from 'react';

import { Button, Flex, Spinner, Tabs, Text } from '@radix-ui/themes';
import { useToast } from 'components/Toast';

import { useGetSoundFiles, useGetSoundSettings } from 'queries/sounds';
import type { SoundType } from 'types/sounds.types';
import { preloadSounds, testAudioPlayback, updateCachedSoundFiles } from 'utils/soundCache.utils';

import { AdminContentLayout, AdminSection } from '../..';
import { FileUploadSection, SoundConfigurationSection, SoundLibrarySection } from './components';
import { styles } from './AdminSoundPage.styles';

export const AdminSoundPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SoundType>('alarm');

  // API hooks
  const { data: soundFiles = [], isLoading: isLoadingFiles } = useGetSoundFiles();
  const { data: soundSettings = { alarm: null, finish: null }, isLoading: isLoadingSettings } =
    useGetSoundSettings();

  // Get sound files for the active tab
  const { data: activeTabSoundFiles = [], isLoading: isLoadingActiveTabFiles } = useGetSoundFiles(activeTab);

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

  if (isLoadingFiles || isLoadingSettings || isLoadingActiveTabFiles) {
    return (
      <AdminContentLayout
        title="Sound Management"
        subtitle="Admin"
        description="Upload and configure sound files for timer events"
        styles={styles}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading sound settings...</Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  log('__DEV: soundFiles', 'orange', soundFiles);

  return (
    <AdminContentLayout
      title="Sound Management"
      subtitle="Admin"
      description="Upload and configure sound files for timer events"
      styles={styles}
    >
      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as SoundType)}>
        <Tabs.List>
          <Tabs.Trigger value="alarm">Alarm Sounds</Tabs.Trigger>
          <Tabs.Trigger value="finish">Finish Sounds</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="alarm">
          {/* Alarm Sound Settings Section */}
          <AdminSection
            title="Alarm Sound Configuration"
            description="Select which sound file to use for alarm events"
          >
            <SoundConfigurationSection
              soundFiles={activeTabSoundFiles}
              soundSettings={soundSettings}
              soundType="alarm"
            />
          </AdminSection>

          {/* Alarm File Upload Section */}
          <AdminSection
            title="Upload Alarm Sound Files"
            description="Add new alarm sound files to your library (MP3, WAV, AIFF supported - AIFF/WAV files are automatically converted to MP3 for optimal web compatibility and smaller file sizes)"
          >
            <FileUploadSection soundType="alarm" />
          </AdminSection>

          {/* Alarm File Library Section */}
          <AdminSection
            title="Alarm Sound Library"
            description={`${activeTabSoundFiles.length} alarm sound file(s) available`}
          >
            <SoundLibrarySection
              soundFiles={activeTabSoundFiles}
              soundSettings={soundSettings}
              soundType="alarm"
            />
          </AdminSection>
        </Tabs.Content>

        <Tabs.Content value="finish">
          {/* Finish Sound Settings Section */}
          <AdminSection
            title="Finish Sound Configuration"
            description="Select which sound file to use for finish events"
          >
            <SoundConfigurationSection
              soundFiles={activeTabSoundFiles}
              soundSettings={soundSettings}
              soundType="finish"
            />
          </AdminSection>

          {/* Finish File Upload Section */}
          <AdminSection
            title="Upload Finish Sound Files"
            description="Add new finish sound files to your library (MP3, WAV, AIFF supported - AIFF/WAV files are automatically converted to MP3 for optimal web compatibility and smaller file sizes)"
          >
            <FileUploadSection soundType="finish" />
          </AdminSection>

          {/* Finish File Library Section */}
          <AdminSection
            title="Finish Sound Library"
            description={`${activeTabSoundFiles.length} finish sound file(s) available`}
          >
            <SoundLibrarySection
              soundFiles={activeTabSoundFiles}
              soundSettings={soundSettings}
              soundType="finish"
            />
          </AdminSection>
        </Tabs.Content>
      </Tabs.Root>
    </AdminContentLayout>
  );
};
