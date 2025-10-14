// Hook exports
export { useGetSoundFiles } from './useGetSoundFiles';
export { useUploadSoundFiles } from './useUploadSoundFiles';
export { useRemoveSoundFile } from './useRemoveSoundFile';
export { useGetSoundSettings } from './useGetSoundSettings';
export { useUpdateSoundSettings } from './useUpdateSoundSettings';

// Query keys
export const GET_SOUND_FILES_QUERYKEY = ['sounds', 'files'] as const;
export const GET_SOUND_FILES_BY_TYPE_QUERYKEY = (soundType: string) =>
  ['sounds', 'files', soundType] as const;
export const GET_SOUND_SETTINGS_QUERYKEY = ['sounds', 'settings'] as const;
