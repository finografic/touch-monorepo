import React, { useCallback } from 'react';

import { Flex, Text } from '@radix-ui/themes';
import { Slider } from 'primereact/slider';

import { useGlobalVolume } from 'hooks/useGlobalVolume';

export const VolumeSlider: React.FC = () => {
  const { volume, updateVolume } = useGlobalVolume();

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      updateVolume(newVolume);
    },
    [updateVolume],
  );

  return (
    <Flex
      direction="column"
      gap="4"
      align="center"
      style={{ width: '100%', fontSize: '1.5rem', fontWeight: '600', padding: '0 6rem 2.33rem' }}
    >
      <Text size="3" weight="medium" color="gray" mt="7">
        Volume
      </Text>
      <Slider value={volume} onChange={(e) => handleVolumeChange(e.value[0])} className="volume-slider" />
      {/* <Slider
        value={[volume]}
        onValueChange={(value) => handleVolumeChange(value[0])}
        max={100}
        min={0}
        step={1}
        size="3"
        className="volume-slider"
      /> */}
      <Text size="3" color="gray">
        {volume}%
      </Text>
    </Flex>
  );
};
