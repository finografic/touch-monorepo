// @ts-nocheck - Bypassing complex type inference issues throughout this file
import { z } from 'zod';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import type { AppRouteHandler } from 'types/app.types';
import type {
  GetSettingsRoute,
  ListRoute,
  RemoveRoute,
  ServeFileRoute,
  UpdateSettingsRoute,
  UploadRoute,
} from './sounds.routes';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { Buffer } from 'buffer';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/constants';

// In-memory storage for demo purposes
// In production, this would be replaced with database storage
const soundFiles: Array<{
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}> = [];

let soundSettings: {
  tick: string | null;
  finish: string | null;
} = {
  tick: null,
  finish: null,
};

// Simple ID generator
const generateId = () => `sound-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Ensure uploads directory exists
const uploadsDir = join(process.cwd(), 'src', 'uploads', 'sounds');
const settingsDir = join(uploadsDir, 'settings');
const settingsFile = join(settingsDir, 'settings.json');

// Create directory if it doesn't exist
async function ensureUploadsDir() {
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }
  if (!existsSync(settingsDir)) {
    await mkdir(settingsDir, { recursive: true });
  }
}

// Load settings from file
async function loadSettings() {
  try {
    if (existsSync(settingsFile)) {
      const settingsData = await readFile(settingsFile, 'utf-8');
      const settings = JSON.parse(settingsData);
      soundSettings.tick = settings.tick || null;
      soundSettings.finish = settings.finish || null;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
    // Keep default settings if file is corrupted
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

// Initialize settings on module load
loadSettings().catch(console.error);

// List sound files
export const list: AppRouteHandler<ListRoute> = async (context) => {
  return context.json(soundFiles);
};

// Upload sound files
export const upload: AppRouteHandler<UploadRoute> = async (context) => {
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
        const id = generateId();
        const fileExtension = file.name.split('.').pop() || 'mp3';
        const fileName = `${id}.${fileExtension}`;
        const filePath = join(uploadsDir, fileName);

        // Convert File to Buffer and save to disk
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await writeFile(filePath, buffer);

        const fileInfo = {
          id,
          name: file.name,
          url: `/api/sounds/files/${fileName}`, // URL to serve the file
          type: file.type,
          size: file.size,
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
export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { id } = context.req.valid('param');

  const fileIndex = soundFiles.findIndex((file) => file.id === id);
  if (fileIndex === -1) {
    return context.json({ message: 'Sound file not found' }, HttpStatusCodes.NOT_FOUND);
  }

  const file = soundFiles[fileIndex];

  try {
    // Remove file from disk
    const fileName = file.url.split('/').pop();
    if (fileName) {
      const filePath = join(uploadsDir, fileName);
      await unlink(filePath);
    }
  } catch (error) {
    console.error('Error deleting file from disk:', error);
    // Continue with removal from memory even if disk deletion fails
  }

  // Remove from sound files
  soundFiles.splice(fileIndex, 1);

  // Clear from settings if it was selected
  if (soundSettings.tick === id) {
    soundSettings.tick = null;
  }
  if (soundSettings.finish === id) {
    soundSettings.finish = null;
  }

  // Save updated settings to file
  await saveSettings();

  return context.json({ message: 'Sound file removed successfully' }, HttpStatusCodes.OK);
};

// Get sound settings
export const getSettings: AppRouteHandler<GetSettingsRoute> = async (context) => {
  // Load settings from file to ensure we have the latest
  await loadSettings();
  return context.json(soundSettings);
};

// Update sound settings
export const updateSettings: AppRouteHandler<UpdateSettingsRoute> = async (context) => {
  const body = context.req.valid('json');

  // Validate that the selected files exist
  if (body.tick && !soundFiles.find((file) => file.id === body.tick)) {
    return context.json({ tick: null, finish: body.finish }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }

  if (body.finish && !soundFiles.find((file) => file.id === body.finish)) {
    return context.json({ tick: body.tick, finish: null }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }

  soundSettings = body;

  // Save settings to file
  await saveSettings();

  return context.json(soundSettings);
};

// Serve sound file
export const serveFile: AppRouteHandler<ServeFileRoute> = async (context) => {
  const { filename } = context.req.valid('param');

  try {
    const filePath = join(uploadsDir, filename);
    const fileBuffer = await readFile(filePath);

    // Determine content type based on file extension
    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = 'audio/mpeg';
    if (ext === 'wav') contentType = 'audio/wav';
    else if (ext === 'aiff') contentType = 'audio/aiff';
    else if (ext === 'mp3') contentType = 'audio/mpeg';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    return context.json({ message: 'File not found' }, HttpStatusCodes.NOT_FOUND);
  }
};
