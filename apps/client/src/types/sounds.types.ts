export type SoundType = 'alarm' | 'finish';

export interface SoundFile {
  id: string;
  name: string;
  originalName?: string; // Optional: original filename for new uploads
  url: string;
  filePath?: string; // Actual server file path for direct access
  type: string;
  size: number;
  uploadedAt: string;
}

export interface SoundSettings {
  alarm: string | null;
  finish: string | null;
}
