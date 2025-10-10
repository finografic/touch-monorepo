import React from 'react';
import { Flex, Spinner, Text } from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../shared';
import { styles } from './AdminSoundPage.styles';
import { useGetSoundFiles, useGetSoundSettings } from 'api/hooks/useSounds';
import { SoundConfigurationSection } from './components';

export const AdminSoundBasicPage: React.FC = () => {
  // API hooks - only get alarm sounds for basic page
  const { data: soundFiles = [], isLoading: isLoadingFiles } = useGetSoundFiles('alarm');
  const { data: soundSettings = { alarm: null, finish: null }, isLoading: isLoadingSettings } =
    useGetSoundSettings();

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

  return (
    <section css={styles} className="admin-content-page">
      <AdminContentLayout
        title="Sound Management (BASIC)"
        subtitle="Upload and configure sound files for timer events"
      >
        <AdminSection
          title="Alarm Sound Configuration"
          description="Select which sound file to use for timer alarm events"
          variant="border-solid"
        >
          <SoundConfigurationSection
            soundFiles={soundFiles}
            soundSettings={soundSettings}
            soundType="alarm"
          />
        </AdminSection>
      </AdminContentLayout>
    </section>
  );
};
