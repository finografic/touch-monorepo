// @ts-nocheck — mirrors sounds.handlers: OpenAPI validators widen `req.valid()` typing.
import { Buffer } from 'node:buffer';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { StatusCodes as HttpStatusCodes } from 'http-status-codes';

import { slugify } from 'utils/string.utils';
import { getMimeType } from 'utils/mime.utils';
import type { AppHandler } from 'types/app.types';
import { CONFIG_PATHS, UPLOAD_PATHS } from '../../constants/paths.constants.js';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const ALLOWED_IMAGE_EXT = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg']);

export type ImageCategory = 'product' | 'label';

export interface ImageFileRecord {
  id: string;
  name: string;
  originalName?: string;
  url: string;
  filePath: string;
  type: string;
  size: number;
  uploadedAt: string;
}

const imageFiles: ImageFileRecord[] = [];

let imageSettings: {
  product: string | null;
  label: string | null;
} = {
  product: null,
  label: null,
};

const uploadsDir = UPLOAD_PATHS.IMAGES_DIR;
const settingsFile = CONFIG_PATHS.IMAGE_SETTINGS;

const isValidImageCategory = (type: string): type is ImageCategory => type === 'product' || type === 'label';

async function ensureUploadsDir() {
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }
}

async function ensureImageCategoryDir(category: ImageCategory) {
  const subDir = path.join(uploadsDir, category);
  if (!existsSync(subDir)) {
    await mkdir(subDir, { recursive: true });
  }
  return subDir;
}

function contentTypeForExtension(ext: string): string {
  const lower = ext.toLowerCase();
  if (lower === 'png') return 'image/png';
  if (lower === 'jpg' || lower === 'jpeg') return 'image/jpeg';
  if (lower === 'webp') return 'image/webp';
  if (lower === 'gif') return 'image/gif';
  if (lower === 'svg') return 'image/svg+xml';
  return 'application/octet-stream';
}

async function loadSettings() {
  try {
    if (existsSync(settingsFile)) {
      const raw = await readFile(settingsFile, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<typeof imageSettings>;
      imageSettings.product = parsed.product ?? null;
      imageSettings.label = parsed.label ?? null;
    }
  } catch (error) {
    console.error('Error loading image settings:', error);
  }
}

async function saveSettings() {
  try {
    await ensureUploadsDir();
    await writeFile(settingsFile, JSON.stringify(imageSettings, null, 2));
  } catch (error) {
    console.error('Error saving image settings:', error);
  }
}

async function validateSettings() {
  let settingsChanged = false;

  for (const key of ['product', 'label'] as const) {
    const selected = imageSettings[key];
    if (!selected) continue;

    const match = imageFiles.find(
      (file) => file.id === selected || file.id === selected.split('.')[0],
    );

    if (!match) {
      imageSettings[key] = null;
      settingsChanged = true;
    } else if (selected !== match.id) {
      imageSettings[key] = match.id;
      settingsChanged = true;
    }
  }

  if (settingsChanged) {
    await saveSettings();
  }
}

async function scanFilesFromDisk() {
  try {
    await ensureUploadsDir();
    imageFiles.length = 0;

    const categories: ImageCategory[] = ['product', 'label'];

    for (const category of categories) {
      try {
        const subDir = await ensureImageCategoryDir(category);
        const names = await readdir(subDir);

        for (const fileName of names) {
          if (fileName === '.gitignore' || fileName.startsWith('_') || !fileName.startsWith('image-')) {
            continue;
          }

          const filePathOnDisk = path.join(subDir, fileName);
          const fileStats = await stat(filePathOnDisk);
          if (!fileStats.isFile()) continue;

          const id = fileName.split('.')[0] ?? fileName;
          const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
          const contentType = contentTypeForExtension(ext);

          let displayName = fileName;
          const imagePattern = /^image-(.+?)-(\d+)-([a-z0-9]+)\.(.+)$/;
          const match = fileName.match(imagePattern);
          if (match) {
            const slugifiedName = match[1];
            displayName = slugifiedName.replace(/-/g, ' ').replace(/_/g, ' ');
          } else {
            displayName = fileName.replace(/\.[^/.]+$/, '');
          }

          imageFiles.push({
            id,
            name: displayName,
            url: `/api/images/files/${fileName}`,
            filePath: fileName,
            type: contentType,
            size: fileStats.size,
            uploadedAt: fileStats.birthtime.toISOString(),
          });
        }
      } catch (error) {
        console.error(`Error scanning image folder ${category}:`, error);
      }
    }

    console.log(`${existsSync(uploadsDir) ? '🖼' : '❌'} ${uploadsDir}`);
    console.log(`${existsSync(uploadsDir) ? '🖼' : '❌'} ${imageFiles.length} image files`);
  } catch (error) {
    console.error('Error scanning image files from disk:', error);
  }
}

void (async () => {
  await scanFilesFromDisk();
  await loadSettings();
  await validateSettings();
})();

export const list: AppHandler = async (context) => {
  return context.json(imageFiles);
};

export const listByType: AppHandler = async (context) => {
  const { type } = context.req.valid('param');

  if (!isValidImageCategory(type)) {
    return context.json({ message: 'Invalid image category' }, HttpStatusCodes.BAD_REQUEST);
  }

  const subDir = await ensureImageCategoryDir(type);
  const names = await readdir(subDir);
  const filtered = imageFiles.filter((file) => names.includes(file.filePath));

  return context.json(filtered);
};

async function persistUploads(
  files: File[],
  targetDir: string,
): Promise<ImageFileRecord[]> {
  const uploaded: ImageFileRecord[] = [];

  for (const file of files) {
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (!ALLOWED_IMAGE_EXT.has(fileExtension)) {
      throw new Error(`Unsupported image type: .${fileExtension}`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > MAX_IMAGE_BYTES) {
      throw new Error(`File too large: ${file.name}`);
    }

    let slugifiedName = slugify(originalName, { isFilename: true });
    if (slugifiedName.startsWith('image-')) {
      slugifiedName = slugifiedName.slice(6);
    }

    const timestamp = Date.now();
    const shortHash = Math.random().toString(36).slice(2, 6);
    const fileName = `image-${slugifiedName}-${timestamp}-${shortHash}.${fileExtension}`;
    const fullPath = path.join(targetDir, fileName);

    await writeFile(fullPath, buffer);

    const id = fileName.split('.')[0] ?? fileName;
    const record: ImageFileRecord = {
      id,
      name: originalName,
      originalName: file.name,
      url: `/api/images/files/${fileName}`,
      filePath: fileName,
      type: contentTypeForExtension(fileExtension),
      size: buffer.length,
      uploadedAt: new Date().toISOString(),
    };

    imageFiles.push(record);
    uploaded.push(record);
  }

  return uploaded;
}

export const uploadByType: AppHandler = async (context) => {
  try {
    const { type } = context.req.valid('param');
    if (!isValidImageCategory(type)) {
      return context.json({ message: 'Invalid image category' }, HttpStatusCodes.BAD_REQUEST);
    }

    await ensureUploadsDir();
    const subDir = await ensureImageCategoryDir(type);

    const formData = await context.req.formData();
    const files = formData.getAll('files') as File[];

    if (!files?.length) {
      return context.json({ message: 'No files provided' }, HttpStatusCodes.BAD_REQUEST);
    }

    const uploadedFiles = await persistUploads(files, subDir);
    return context.json(uploadedFiles);
  } catch (error) {
    console.error('Image upload error:', error);
    return context.json(
      { message: error instanceof Error ? error.message : 'Upload failed' },
      HttpStatusCodes.BAD_REQUEST,
    );
  }
};

async function deleteImageFromDisk(file: ImageFileRecord) {
  const categories: ImageCategory[] = ['product', 'label'];
  for (const category of categories) {
    const subDir = await ensureImageCategoryDir(category);
    const candidate = path.join(subDir, file.filePath);
    if (existsSync(candidate)) {
      await unlink(candidate);
      return;
    }
  }
  const rootPath = path.join(uploadsDir, file.filePath);
  if (existsSync(rootPath)) {
    await unlink(rootPath);
  }
}

export const remove: AppHandler = async (context) => {
  const { id } = context.req.valid('param');
  const fileIndex = imageFiles.findIndex((file) => file.id === id);
  if (fileIndex === -1) {
    return context.json({ message: 'Image file not found' }, HttpStatusCodes.NOT_FOUND);
  }

  const [file] = imageFiles.splice(fileIndex, 1);

  try {
    await deleteImageFromDisk(file);
  } catch (error) {
    console.error('Error deleting image from disk:', error);
  }

  if (imageSettings.product === id) imageSettings.product = null;
  if (imageSettings.label === id) imageSettings.label = null;
  await saveSettings();

  return context.json({ message: 'Image file removed successfully' }, HttpStatusCodes.OK);
};

export const removeByType: AppHandler = async (context) => {
  const { type, id } = context.req.valid('param');
  if (!isValidImageCategory(type)) {
    return context.json({ message: 'Invalid image category' }, HttpStatusCodes.BAD_REQUEST);
  }

  const fileIndex = imageFiles.findIndex((file) => file.id === id);
  if (fileIndex === -1) {
    return context.json({ message: 'Image file not found' }, HttpStatusCodes.NOT_FOUND);
  }

  const [file] = imageFiles.splice(fileIndex, 1);

  try {
    const subDir = await ensureImageCategoryDir(type);
    await unlink(path.join(subDir, file.filePath));
  } catch (error) {
    console.error('Error deleting image from disk:', error);
  }

  if (imageSettings.product === id) imageSettings.product = null;
  if (imageSettings.label === id) imageSettings.label = null;
  await saveSettings();

  return context.json({ message: 'Image file removed successfully' }, HttpStatusCodes.OK);
};

export const getSettings: AppHandler = async (context) => {
  return context.json(imageSettings);
};

export const updateSettings: AppHandler = async (context) => {
  const body = context.req.valid('json') as typeof imageSettings;

  if (body.product && !imageFiles.find((file) => file.id === body.product)) {
    return context.json({ product: null, label: body.label }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }

  if (body.label && !imageFiles.find((file) => file.id === body.label)) {
    return context.json({ product: body.product, label: null }, HttpStatusCodes.UNPROCESSABLE_ENTITY);
  }

  imageSettings = body;
  await saveSettings();

  return context.json(imageSettings);
};

export const serveFile: AppHandler = async (context) => {
  const { filename } = context.req.valid('param');

  try {
    const categories: ImageCategory[] = ['product', 'label'];

    for (const category of categories) {
      const subDir = await ensureImageCategoryDir(category);
      const filePath = path.join(subDir, filename);
      if (existsSync(filePath)) {
        const fileBuffer = await readFile(filePath);
        const { mimeType } = getMimeType({ filePath: filename, pathModule: path });
        return new Response(fileBuffer, {
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=31536000',
          },
        });
      }
    }

    const rootPath = path.join(uploadsDir, filename);
    if (existsSync(rootPath)) {
      const fileBuffer = await readFile(rootPath);
      const { mimeType } = getMimeType({ filePath: filename, pathModule: path });
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    return context.json({ message: 'File not found' }, HttpStatusCodes.NOT_FOUND);
  } catch {
    return context.json({ message: 'File not found' }, HttpStatusCodes.NOT_FOUND);
  }
};
