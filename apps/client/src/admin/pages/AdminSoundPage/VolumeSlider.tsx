import React, { useState } from 'react';

import { Slider } from '@workspace/design-system/forms';
import { Flex } from 'styled-system/jsx';
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
      gap={4}
      align="center"
      style={{
        width: '100%',
        fontSize: '1.5rem',
        fontWeight: '600',
        padding: '0 2rem',
      }}
    >
      <span>Volume</span>
      <Slider.Root
        value={displayVolume}
        onValueChange={(newVolume) => {
          setDisplayVolume(newVolume);
          handleVolumeChange(newVolume);
        }}
        min={0}
        max={100}
        step={1}
        className="volume-slider"
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0} />
        </Slider.Control>
      </Slider.Root>
      <span>{displayVolume}%</span>
    </Flex>
  );
};
