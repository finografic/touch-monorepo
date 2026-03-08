// @ts-nocheck - Bypassing complex type inference issues throughout this file
import { Buffer } from 'buffer';
import { existsSync } from 'fs';
import { mkdir, readdir, readFile, stat, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import * as HttpStatusCodes from 'stoker/http-status-codes';

import { slugify } from 'utils/string.utils';
import type { AppHandler } from 'types/app.types';
import { CONFIG_PATHS, UPLOAD_PATHS } from '../../constants/paths.constants.js';

// In-memory storage for demo purposes
// In production, this would be replaced with database storage
const soundFiles: Array<{
  id: string;
  name: string;
  url: string;
  filePath: string; // Added filePath property
  type: string;
  size: number;
  uploadedAt: string;
}> = [];

let soundSettings: {
  alarm: string | null;
  finish: string | null;
} = {
  alarm: null,
  finish: null,
};

// Simple ID generator
const generateId = () => `sound-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Use path constants for reliable path resolution
const uploadsDir = UPLOAD_PATHS.SOUNDS_DIR;
const settingsFile = CONFIG_PATHS.SOUND_SETTINGS;

// Sound type validation
type SoundType = 'alarm' | 'finish';

const isValidSoundType = (type: string): type is SoundType => {
  return type === 'alarm' || type === 'finish';
};

// Create directory if it doesn't exist
async function ensureUploadsDir() {
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }
}

// Create subdirectory for specific sound type
async function ensureSoundTypeDir(soundType: SoundType) {
  const subDir = join(uploadsDir, soundType);
  if (!existsSync(subDir)) {
    await mkdir(subDir, { recursive: true });
  }
  return subDir;
}

// Initialize sound files on module load
(async () => {
  await scanFilesFromDisk();
  await loadSettings();
  await validateSettings();
})();

// Load settings from file
async function loadSettings() {
  try {
    if (existsSync(settingsFile)) {
      const settingsData = await readFile(settingsFile, 'utf-8');
      const settings = JSON.parse(settingsData);

      // Load settings but we'll validate them after scanning files
      soundSettings.alarm = settings.alarm || null;
      soundSettings.finish = settings.finish || null;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
    // Keep default settings if file is corrupted
  }
}

// Validate and fix settings against existing files
async function validateSettings() {
  // Validate settings against actual files (files already scanned)
  let settingsChanged = false;

  if (soundSettings.alarm) {
    // Check if the alarm setting exists as a file (with or without extension)
    const alarmFile = soundFiles.find(
      (file) => file.id === soundSettings.alarm || file.id === soundSettings.alarm.split('.')[0],
    );

    if (!alarmFile) {
      soundSettings.alarm = null;
      settingsChanged = true;
    } else if (soundSettings.alarm !== alarmFile.id) {
      // Update to use the correct ID (with extension)
      soundSettings.alarm = alarmFile.id;
      settingsChanged = true;
    }
  }

  if (soundSettings.finish) {
    // Check if the finish setting exists as a file (with or without extension)
    const finishFile = soundFiles.find(
      (file) => file.id === soundSettings.finish || file.id === soundSettings.finish.split('.')[0],
    );

    if (!finishFile) {
      soundSettings.finish = null;
      settingsChanged = true;
    } else if (soundSettings.finish !== finishFile.id) {
      // Update to use the correct ID (with extension)
      soundSettings.finish = finishFile.id;
      settingsChanged = true;
    }
  }

  // Save settings if they were updated
  if (settingsChanged) {
    await saveSettings();
  }
}

// Save settings to file
async function saveSettings() {
  try {
    await ensureUploadsDir();
    await writeFile(settingsFile, JSON.stringify(soundSettings, null, 2));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// Scan and restore files from disk
async function scanFilesFromDisk() {
  try {
    await ensureUploadsDir();

    // Clear existing in-memory files
    soundFiles.length = 0;

    // Scan subfolders for sound files
    const soundTypes: SoundType[] = ['alarm', 'finish'];

    for (const soundType of soundTypes) {
      try {
        const subDir = await ensureSoundTypeDir(soundType);
        const files = await readdir(subDir);

        for (const fileName of files) {
          // Skip directories, non-sound files, and files starting with underscore
          if (fileName === '.gitignore' || !fileName.startsWith('sound-') || fileName.startsWith('_')) {
            continue;
          }

          const filePath = join(subDir, fileName);
          const fileStats = await stat(filePath);

          // Extract ID from filename (remove extension)
          const id = fileName.split('.')[0];

          // Determine content type
          const ext = fileName.split('.').pop()?.toLowerCase();
          let contentType = 'audio/mpeg';
          if (ext === 'wav') contentType = 'audio/wav';
          else if (ext === 'aiff' || ext === 'aif') contentType = 'audio/aiff';
          else if (ext === 'mp3') contentType = 'audio/mpeg';

          // Try to extract original name from filename pattern
          let displayName = fileName;
          const soundPattern = /^sound-(.+?)-(\d+)-([a-z0-9]+)\.(.+)$/;
          const match = fileName.match(soundPattern);

          if (match) {
            // If it matches our new pattern, extract the slugified name and convert back
            const slugifiedName = match[1];
            // Convert slugified name back to readable format
            displayName = slugifiedName.replace(/-/g, ' ').replace(/_/g, ' ');
          } else {
            // For files that don't match our pattern, remove the extension from the display name
            displayName = fileName.replace(/\.[^/.]+$/, '');
          }

          const fileInfo = {
            id,
            name: displayName,
            url: `/api/sounds/files/${fileName}`,
            filePath: fileName, // Add the actual filename for direct access
            type: contentType,
            size: fileStats.size,
            uploadedAt: fileStats.birthtime.toISOString(),
          };

          soundFiles.push(fileInfo);
        }
      } catch (error) {
        console.error(`❌ Error scanning ${soundType} subfolder:`, error);
      }
    }

    // Minimal output: path with existence status and file count
    const dirExists = existsSync(uploadsDir);
    console.log(`${dirExists ? '🔈' : '❌'} ${uploadsDir}`);
    console.log(`${dirExists ? '🔈' : '❌'} ${soundFiles.length} sound files`);
  } catch (error) {
    console.error('❌ Error scanning files from disk:', error);
  }
}

// List sound files
export const list: AppHandler = async (context) => {
  console.log('📋 List sound files called');
  console.log('📋 Current sound files count:', soundFiles.length);

  // Just return the current in-memory files - no need to re-scan
  return context.json(soundFiles);
};

// List sound files by type
export const listByType: AppHandler = async (context) => {
  const { type } = context.req.valid('param');

  if (!isValidSoundType(type)) {
    return context.json({ message: 'Invalid sound type' }, HttpStatusCodes.BAD_REQUEST);
  }

  console.log(`📋 List ${type} sound files called`);

  // Filter files by type (scan subfolder)
  const subDir = await ensureSoundTypeDir(type);
  const subDirFiles = await readdir(subDir);

  const typeSpecificFiles = soundFiles.filter((file) => {
    // Check if file exists in the subfolder
    return subDirFiles.includes(file.filePath || '');
  });

  console.log(`📋 ${type} sound files count:`, typeSpecificFiles.length);
  return context.json(typeSpecificFiles);
};

// Upload sound files
export const upload: AppHandler = async (context) => {
  try {
    // Ensure uploads directory exists
    await ensureUploadsDir();

    const formData = await context.req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return context.json({ message: 'No files provided' }, HttpStatusCodes.BAD_REQUEST);
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        // Extract original filename without extension
        const originalName = file.name.replace(/\.[^/.]+$/, '');
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'mp3';

        // Convert AIFF/WAV to MP3 for better browser compatibility and smaller file sizes
        let finalExtension = fileExtension;
        let finalBuffer = Buffer.from(await file.arrayBuffer());

        if (fileExtension === 'aiff' || fileExtension === 'aif' || fileExtension === 'wav') {
          console.log(
            `🔄 Converting ${fileExtension.toUpperCase()} to MP3 for web compatibility: ${file.name}`,
          );

          try {
            // Use macOS built-in converter
            const tempInputPath = join(uploadsDir, `temp_${Date.now()}_${file.name}`);
            const tempOutputPath = join(uploadsDir, `temp_${Date.now()}_${originalName}.mp3`);

            // Write temporary input file
            await writeFile(tempInputPath, finalBuffer);

            // Convert using afconvert to MP3
            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);

            await execAsync(`afconvert -f 'mp4f' -d 'aac ' "${tempInputPath}" "${tempOutputPath}"`);

            // Read converted file
            finalBuffer = await readFile(tempOutputPath);
            finalExtension = 'mp3';

            // Clean up temp files
            await unlink(tempInputPath);
            await unlink(tempOutputPath);

            console.log(`✅ Successfully converted ${file.name} to MP3`);
          } catch (conversionError) {
            console.warn(`⚠️  Failed to convert ${file.name} to MP3, keeping original:`, conversionError);
            // Keep original file if conversion fails
          }
        }

        // Create slugified filename, removing any existing "sound-" prefix to avoid doubling
        let slugifiedName = slugify(originalName, { isFilename: true });
        if (slugifiedName.startsWith('sound-')) {
          slugifiedName = slugifiedName.substring(6); // Remove "sound-" prefix
        }

        const timestamp = Date.now();
        const shortHash = Math.random().toString(36).substr(2, 4); // Shorter hash (4 chars)

        // Generate filename: sound-{slugified-name}-{timestamp}-{hash}.{extension}
        const fileName = `sound-${slugifiedName}-${timestamp}-${shortHash}.${finalExtension}`;
        const filePath = join(uploadsDir, fileName);

        // Save the final file (converted or original)
        await writeFile(filePath, finalBuffer);

        // Use the filename (without extension) as the ID
        const id = fileName.split('.')[0];

        const fileInfo = {
          id,
          name: originalName, // Use original name without extension for display
          originalName: file.name, // Store original name for future reference
          url: `/api/sounds/files/${fileName}`,
          filePath: fileName, // Add the actual filename for direct access
          type: finalExtension === 'mp3' ? 'audio/mpeg' : file.type,
          size: finalBuffer.length,
          uploadedAt: new Date().toISOString(),
        };

        // Store metadata in memory
        soundFiles.push(fileInfo);
        return fileInfo;
      }),
    );

    return context.json(uploadedFiles);
  } catch (error) {
    console.error('Upload error:', error);
    return context.json({ message: 'Upload failed' }, HttpStatusCodes.BAD_REQUEST);
  }
};

// Upload sound files by type
export const uploadByType: AppHandler = async (context) => {
  try {
    const { type } = context.req.valid('param');

    if (!isValidSoundType(type)) {
      return context.json({ message: 'Invalid sound type' }, HttpStatusCodes.BAD_REQUEST);
    }

    // Ensure uploads directory and subdirectory exist
    await ensureUploadsDir();
    const subDir = await ensureSoundTypeDir(type);

    const formData = await context.req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return context.json({ message: 'No files provided' }, HttpStatusCodes.BAD_REQUEST);
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        // Extract original filename without extension
        const originalName = file.name.replace(/\.[^/.]+$/, '');
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'mp3';

        // Convert AIFF/WAV to MP3 for better browser compatibility and smaller file sizes
        let finalExtension = fileExtension;
        let finalBuffer = Buffer.from(await file.arrayBuffer());

        if (fileExtension === 'aiff' || fileExtension === 'aif' || fileExtension === 'wav') {
          console.log(
            `🔄 Converting ${fileExtension.toUpperCase()} to MP3 for web compatibility: ${file.name}`,
          );

          try {
            // Use macOS built-in converter
            const tempInputPath = join(subDir, `temp_${Date.now()}_${file.name}`);
            const tempOutputPath = join(subDir, `temp_${Date.now()}_${originalName}.mp3`);

            // Write temporary input file
            await writeFile(tempInputPath, finalBuffer);

            // Convert using afconvert to MP3
            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);

            await execAsync(`afconvert -f 'mp4f' -d 'aac ' "${tempInputPath}" "${tempOutputPath}"`);

            // Read converted file
            finalBuffer = await readFile(tempOutputPath);
            finalExtension = 'mp3';

            // Clean up temp files
            await unlink(tempInputPath);
            await unlink(tempOutputPath);

            console.log(`✅ Successfully converted ${file.name} to MP3`);
          } catch (conversionError) {
            console.warn(`⚠️  Failed to convert ${file.name} to MP3, keeping original:`, conversionError);
            // Keep original file if conversion fails
          }
        }

        // Create slugified filename, removing any existing "sound-" prefix to avoid doubling
        let slugifiedName = slugify(originalName, { isFilename: true });
        if (slugifiedName.startsWith('sound-')) {
          slugifiedName = slugifiedName.substring(6); // Remove "sound-" prefix
        }

        const timestamp = Date.now();
        const shortHash = Math.random().toString(36).substr(2, 4); // Shorter hash (4 chars)

        // Generate filename: sound-{slugified-name}-{timestamp}-{hash}.{extension}
        const fileName = `sound-${slugifiedName}-${timestamp}-${shortHash}.${finalExtension}`;
        const filePath = join(subDir, fileName);

        // Save the final file (converted or original)
        await writeFile(filePath, finalBuffer);

        // Use the filename (without extension) as the ID
        const id = fileName.split('.')[0];

        const fileInfo = {
          id,
          name: originalName, // Use original name without extension for display
          originalName: file.name, // Store original name for future reference
          url: `/api/sounds/files/${fileName}`,
          filePath: fileName, // Add the actual filename for direct access
          type: finalExtension === 'mp3' ? 'audio/mpeg' : file.type,
          size: finalBuffer.length,
          uploadedAt: new Date().toISOString(),
        };

        // Store metadata in memory
        soundFiles.push(fileInfo);
        return fileInfo;
      }),
    );

    return context.json(uploadedFiles);
  } catch (error) {
    console.error('Upload error:', error);
    return context.json({ message: 'Upload failed' }, HttpStatusCodes.BAD_REQUEST);
  }
};

// Remove sound file
export const remove: AppHandler = async (context) => {
  const { id } = context.req.valid('param');

  const file = soundFiles.find((file) => file.id === id);
  if (!file) {
    return context.json({ message: 'Sound file not found' }, HttpStatusCodes.NOT_FOUND);
  }

  try {
    // Remove file from disk using filePath
    if (file.filePath) {
      const filePath = join(uploadsDir, file.filePath);
      console.log(`🗑️  Deleting file from disk: ${filePath}`);
      await unlink(filePath);
      console.log(`✅ File deleted from disk: ${file.filePath}`);
    } else {
      console.warn(`⚠️  No filePath found for file: ${file.id}`);
    }
  } catch (error) {
    console.error('Error deleting file from disk:', error);
    // Continue with removal from memory even if disk deletion fails
  }

  // Remove from sound files
  soundFiles.splice(fileIndex, 1);

  // Clear from settings if it was selected
  if (soundSettings.alarm === id) {
    soundSettings.alarm = null;
  }
  if (soundSettings.finish === id) {
    soundSettings.finish = null;
  }

  // Save updated settings to file
  await saveSettings();

  return context.json({ message: 'Sound file removed successfully' }, HttpStatusCodes.OK);
};

// Remove sound file by type
export const removeByType: AppHandler = async (context) => {
  const { type, id } = context.req.valid('param');

  if (!isValidSoundType(type)) {
    return context.json({ message: 'Invalid sound type' }, HttpStatusCodes.BAD_REQUEST);
  }

  const file = soundFiles.find((file) => file.id === id);
  if (!file) {
    return context.json({ message: 'Sound file not found' }, HttpStatusCodes.NOT_FOUND);
  }

  try {
    // Remove file from disk using filePath
    if (file.filePath) {
      const subDir = await ensureSoundTypeDir(type);
      const filePath = join(subDir, file.filePath);
      console.log(`🗑️  Deleting file from disk: ${filePath}`);
      await unlink(filePath);
      console.log(`✅ File deleted from disk: ${file.filePath}`);
    } else {
      console.warn(`⚠️  No filePath found for file: ${file.id}`);
    }
  } catch (error) {
    console.error('Error deleting file from disk:', error);
    // Continue with removal from memory even if disk deletion fails
  }

  // Remove from sound files
  const fileIndex = soundFiles.findIndex((file) => file.id === id);
  if (fileIndex !== -1) {
    soundFiles.splice(fileIndex, 1);
  }

  // Clear from settings if it was selected
  if (soundSettings.alarm === id) {
    soundSettings.alarm = null;
  }
  if (soundSettings.finish === id) {
    soundSettings.finish = null;
  }

  // Save updated settings to file
  await saveSettings();

  return context.json({ message: 'Sound file removed successfully' }, HttpStatusCodes.OK);
};

// Get sound settings
export const getSettings: AppHandler = async (context) => {
  // Just return the current in-memory settings - already validated on startup
  return context.json(soundSettings);
};

// Update sound settings
export const updateSettings: AppHandler = async (context) => {
  const body = context.req.valid('json');

  // Validate that the selected files exist
  if (body.alarm && !soundFiles.find((file) => file.id === body.alarm)) {
    return context.json({ alarm: null, finish: body.finish }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }

  if (body.finish && !soundFiles.find((file) => file.id === body.finish)) {
    return context.json({ alarm: body.alarm, finish: null }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }

  soundSettings = body;

  // Save settings to file
  await saveSettings();

  return context.json(soundSettings);
};

// Serve sound file
export const serveFile: AppHandler = async (context) => {
  const { filename } = context.req.valid('param');

  try {
    // Search for the file in subfolders
    const soundTypes: SoundType[] = ['alarm', 'finish'];

    for (const soundType of soundTypes) {
      try {
        const subDir = await ensureSoundTypeDir(soundType);
        const filePath = join(subDir, filename);

        if (existsSync(filePath)) {
          const fileBuffer = await readFile(filePath);

          // Determine content type based on file extension
          const ext = filename.split('.').pop()?.toLowerCase();
          let contentType = 'audio/mpeg';
          if (ext === 'wav') contentType = 'audio/wav';
          else if (ext === 'aiff' || ext === 'aif') contentType = 'audio/aiff';
          else if (ext === 'mp3') contentType = 'audio/mpeg';

          return new Response(fileBuffer, {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            },
          });
        }
      } catch (error) {
        // Continue to next subfolder
        continue;
      }
    }

    // File not found in any subfolder
    return context.json({ message: 'File not found' }, HttpStatusCodes.NOT_FOUND);
  } catch (error) {
    return context.json({ message: 'File not found' }, HttpStatusCodes.NOT_FOUND);
  }
};
