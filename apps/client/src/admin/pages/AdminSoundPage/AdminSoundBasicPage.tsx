import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Slider, Spinner, Text } from '@radix-ui/themes';
import { AdminContentLayout, AdminSection } from '../..';
import { styles } from './AdminSoundPage.styles';
import { useGetSoundFiles, useGetSoundSettings } from 'queries/sounds';
import { SoundConfigurationSection } from './components';
import { Col, Row } from 'react-grid-system';
import { DEFAULT_VOLUME, getStoredVolume, setStoredVolume } from 'utils/volume.utils';

export const AdminSoundBasicPage: React.FC = () => {
  // Volume state and storage
  const [volume, setVolume] = useState<number>(() => getStoredVolume());

  // Debounced volume storage
  const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);

  const debouncedSetVolume = useCallback(
    (newVolume: number) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      const timeout = window.setTimeout(() => {
        setStoredVolume(newVolume);
        console.log(`Volume saved to sessionStorage: ${newVolume}%`);
      }, 300); // 300ms debounce

      setDebounceTimeout(timeout);
    },
    [debounceTimeout],
  );

  const handleVolumeChange = useCallback(
    (value: number[]) => {
      const newVolume = value[0];
      setVolume(newVolume);
      debouncedSetVolume(newVolume);
    },
    [debouncedSetVolume],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  // API hooks - only get alarm sounds for basic page
  const { data: soundFiles = [], isLoading: isLoadingFiles } = useGetSoundFiles('alarm');
  const { data: soundSettings = { alarm: null, finish: null }, isLoading: isLoadingSettings } =
    useGetSoundSettings();

  if (isLoadingFiles || isLoadingSettings) {
    return (
      <AdminContentLayout
        title="Sound Management"
        subtitle="User"
        description="Upload and configure sound files for timer events"
        css={styles}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading sound settings...</Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  return (
    <section css={styles} className="admin-content-page">
      <AdminContentLayout
        title="Sound Management"
        subtitle="User"
        description="Upload and configure sound files for timer events"
        css={styles}
      >
        <AdminSection
          title="Alarm Sound Configuration"
          description="Select which sound file to use for timer alarm events"
        >
          <Row justify="between" align="center">
            <Col xs={9}>
              <SoundConfigurationSection
                soundFiles={soundFiles}
                soundSettings={soundSettings}
                soundType="alarm"
              />
            </Col>
            <Col xs={3}>
              <Flex direction="column" gap="2" align="center" className="volume-control">
                <Flex
                  direction="column"
                  gap="2"
                  align="center"
                  style={{ width: '100%', fontSize: '1.5rem', fontWeight: '600', padding: '0 4rem' }}
                  mr="8"
                >
                  <Text size="2" weight="medium" color="gray">
                    Volume
                  </Text>
                  <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    min={0}
                    step={1}
                    size="3"
                    className="volume-slider"
                  />
                  <Text size="3" color="gray">
                    {volume}%
                  </Text>
                </Flex>
              </Flex>
            </Col>
          </Row>
        </AdminSection>
      </AdminContentLayout>
    </section>
  );
};
