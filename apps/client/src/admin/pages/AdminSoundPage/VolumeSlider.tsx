import React, { useState } from 'react';

import { Text } from '@radix-ui/themes';
import { Flex } from 'styled-system/jsx';
import { Slider } from 'primereact/slider';
import { useDebouncedCallback } from 'use-debounce';

import { useGlobalVolume } from 'hooks/useGlobalVolume';

export const VolumeSlider: React.FC = () => {
  const { volume, updateVolume } = useGlobalVolume();
  const [displayVolume, setDisplayVolume] = useState(volume);

  const handleVolumeChange = useDebouncedCallback((newVolume: number) => {
    updateVolume(newVolume);
  }, 150);

  return (
    <Flex
      direction="column"
      gap="4"
      align="center"
      style={{
        width: '100%',
        fontSize: '1.5rem',
        fontWeight: '600',
        padding: '0 2rem',
      }}
    >
      <Text size="3" weight="medium" color="gray" mt="7">
        Volume
      </Text>
      <Slider
        value={displayVolume}
        onChange={(e) => {
          setDisplayVolume(e.value as number);
          handleVolumeChange(e.value as number);
        }}
        min={0}
        max={100}
        step={1}
        className="volume-slider"
      />
      <Text size="3" color="gray">
        {displayVolume}%
      </Text>
    </Flex>
  );
};
