# Global Volume Control System

📅 Oct 14, 2025

## Overview

The app now has a **global volume control system** that ensures all sounds played throughout the application use the same volume setting controlled by the user via the volume slider in `AdminSoundBasicPage.tsx`.

## How It Works

### 1. Volume Storage

- Volume is stored in `sessionStorage` with the key `'sound-volume'`
- Default volume is 50% (0.5 in audio terms)
- Volume range: 0-100% (0-1 in audio terms)

### 2. Volume Slider

- Located in `AdminSoundBasicPage.tsx`
- Uses Radix UI Slider component
- Updates volume in real-time with 300ms debounce
- Persists across page reloads

### 3. Automatic Volume Application

- All sound playing functions automatically apply the global volume setting
- No need to pass volume parameters to sound functions
- Volume is applied at the `AudioManager.playAudio()` level

## Updated Functions

### Sound Cache Utils (`soundCache.utils.ts`)

- `playCachedSound(fileId)` - No volume parameter needed
- `playSoundFromUrl(fileId)` - No volume parameter needed
- `playSoundByPath(filePath)` - No volume parameter needed
- `testAudioPlayback()` - Uses global volume

### Sound Utils (`sound.utils.ts`)

- `playTickSound()` - No volume parameter needed
- `playCompleteSound()` - No volume parameter needed
- `playCustomSound(soundUrl)` - No volume parameter needed
- `makeUserSound(key)` - No volume parameter needed
- `makeDefaultSound()` - Uses global volume
- `playSoundFromConfig(config, soundType)` - No volume parameter needed

## Usage Examples

### Playing Sounds (New Way)

```typescript
// All these now automatically use the global volume setting
await playTickSound();
await playCompleteSound();
await playCachedSound('sound-id');
await playSoundByPath('sound-file.mp3');
```

### Volume Management

```typescript
import { useGlobalVolume } from 'hooks/useGlobalVolume';

const { volume, updateVolume, audioVolume } = useGlobalVolume();

// Update volume (0-100)
updateVolume(75);

// Get current volume as decimal for audio elements (0-1)
const currentAudioVolume = audioVolume;
```

### Manual Volume Application

```typescript
import { applyStoredVolumeToAudio } from 'utils/volume.utils';

const audio = new Audio('sound.mp3');
applyStoredVolumeToAudio(audio); // Applies current global volume
```

## Benefits

1. **Consistent Volume**: All sounds use the same volume setting
2. **User Control**: Single slider controls all app sounds
3. **Persistence**: Volume setting survives page reloads
4. **Simplified API**: No need to pass volume parameters
5. **Real-time Updates**: Volume changes apply immediately to new sounds

## Migration Notes

- All existing sound function calls with volume parameters have been updated
- Volume parameters are now ignored (functions use global setting instead)
- No breaking changes to existing code - functions work the same way
- Volume slider provides immediate feedback and persistence

## Technical Details

- **Storage**: `sessionStorage.getItem('sound-volume')`
- **Default**: 50% (0.5 audio volume)
- **Range**: 0-100% (0-1 audio volume)
- **Debounce**: 300ms for storage updates
- **Cross-tab**: Storage events sync volume across browser tabs
