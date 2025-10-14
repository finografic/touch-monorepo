# Sound Management System

This document explains the sound management system for timer events in the Touch application.

## Overview

The sound system supports two types of timer sounds:
- **Alarm Sounds**: Played during timer intervals (every 2 minutes by default)
- **Finish Sounds**: Played when a timer completes

## File Structure

```plaintext
data/uploads/sounds/
├── _settings.json          # Sound configuration file
├── alarm/                  # Alarm sound files directory
│   └── sound--alarm-*.mp3
└── finish/                 # Finish sound files directory
    └── sound--finish-*.mp3
```

## Configuration

The `_settings.json` file contains the currently selected sounds:

```json
{
  "alarm": "sound--alarm-1760094208933-nm5t",
  "finish": "sound--finish-1760094183733-dkak"
}
```

- `alarm`: ID of the selected alarm sound file (or `null` if none selected)
- `finish`: ID of the selected finish sound file (or `null` if none selected)

## API Endpoints

### Sound Files

- `GET /api/sounds/alarm` - List alarm sound files
- `GET /api/sounds/finish` - List finish sound files
- `GET /api/sounds/files/{filename}` - Serve sound file

### Sound Settings

- `GET /api/sounds/settings` - Get current sound settings
- `PUT /api/sounds/settings` - Update sound settings

### File Management

- `POST /api/sounds/alarm/upload` - Upload alarm sound files
- `POST /api/sounds/finish/upload` - Upload finish sound files
- `DELETE /api/sounds/alarm/{id}` - Remove alarm sound file
- `DELETE /api/sounds/finish/{id}` - Remove finish sound file

## Supported Formats

- **MP3**: Recommended format for web compatibility
- **WAV**: Supported, automatically converted to MP3
- **AIFF**: Supported, automatically converted to MP3

Files are automatically converted to MP3 for optimal web compatibility and smaller file sizes.

## Browser Autoplay Policy

Modern browsers block audio playback unless triggered by a direct user gesture (click, tap, keypress). This affects timer sounds that play automatically.

### Solutions

1. **Site-Specific Permissions** (Recommended)
   - In Chrome: Click lock icon → Site settings → Sound: Allow
   - This allows programmatic sounds without user gestures
   - Setting persists after page reload

2. **User Gesture Priming**
   - User clicks a button to "prime" the audio system
   - Subsequent programmatic sounds work for a limited time
   - Not 100% reliable, may reset after inactivity

3. **Electron/Native Wrappers**
   - Can disable autoplay restrictions via command-line flags
   - Example: `--autoplay-policy=no-user-gesture-required`

## Usage in Code

### Timer Integration

```typescript
import { playTickSound, playCompleteSound } from 'utils/sound.utils';

// Play alarm sound during timer intervals
// Volume is automatically applied from global settings
await playTickSound();

// Play finish sound when timer completes
// Volume is automatically applied from global settings
await playCompleteSound();
```

### Sound Configuration

```typescript
import { makeUserSound } from 'utils/sound.utils';
import { playSoundByPath } from 'utils/soundCache.utils';

// Play sounds by type (volume applied automatically)
makeUserSound('alarm');
makeUserSound('complete');

// Play sound by file path (volume applied automatically)
await playSoundByPath('sound--alarm-1234567890-xyz.mp3');
```

### Volume Management

```typescript
import { useGlobalVolume } from 'hooks/useGlobalVolume';
import { updatePlayingAudioVolume } from 'utils/soundCache.utils';

// In a React component
const { volume, updateVolume, audioVolume } = useGlobalVolume();

// Update volume (0-100)
updateVolume(75); // Sets slider to 75%, actual audio to 15%

// Get current volume for audio elements (0-0.2)
const currentAudioVolume = audioVolume; // e.g., 0.12 for 60% slider

// Update volume of currently playing audio
updatePlayingAudioVolume(50); // Changes playing audio to 50% slider (10% actual)
```

## Volume Control

The system includes a global volume control that affects all sound playback.

### Volume Settings

- **Default Volume**: 60% (on slider)
- **Volume Range**: 0-100% (user-facing slider)
- **Actual Audio Range**: 0-20% (scaled down for comfort)
- **Volume Scaling**: Slider value × 0.2 = actual audio volume

Example:
- 60% slider (default) = 12% actual audio volume
- 100% slider (max) = 20% actual audio volume
- 50% slider = 10% actual audio volume

### Real-Time Volume Adjustment

- Volume changes apply **immediately** to currently playing audio
- No need to restart playback to hear volume changes
- Volume setting persists in browser session storage

### Panic Button

- **Stop All Audio** button immediately stops all playing sounds
- Useful for stopping alarm sounds during testing
- Located next to the volume slider in the admin interface

## Admin Interface

### Full Admin Page (`/admin/sounds`)

- Tabbed interface for managing alarm and finish sounds
- Upload, configure, and manage sound files
- Test sound playback with real-time volume control
- View sound library
- Volume slider with panic button

### Basic Admin Page (`/admin/sounds-basic` - public version)

- Simplified interface showing only alarm sound selection
- Global volume control slider
- Panic button to stop all audio
- No file upload or management capabilities
- Focused on essential sound configuration

## File Naming Convention

Sound files follow this naming pattern:

```plaintext
sound--{type}-{timestamp}-{randomId}.mp3
```

Examples:
- `sound--alarm-1760094208933-nm5t.mp3`
- `sound--finish-1760094183733-dkak.mp3`

The system automatically extracts display names from filenames for user-friendly selection.

## Troubleshooting

### Common Issues

1. **Sounds not playing**
   - Check browser autoplay policy
   - Verify site sound permissions
   - Check console for errors

2. **Files not appearing**
   - Ensure files are in correct subfolder (`alarm/` or `finish/`)
   - Check file naming convention
   - Verify server file scanning

3. **Upload failures**
   - Check file format (MP3, WAV, AIFF)
   - Verify file size limits (10MB max)
   - Check server disk space

### Debug Information

The system provides detailed logging:
- File scanning and discovery
- Sound playback attempts
- Cache management
- Error handling

Check browser console and server logs for troubleshooting information.
