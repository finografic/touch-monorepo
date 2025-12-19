import type { PlatformPath } from 'node:path';

export const getMimeType = ({
  filePath,
  pathModule,
}: {
  filePath: string;
  pathModule: PlatformPath;
}): { mimeType: string; ext: string } => {
  // Determine MIME type based on file extension
  const ext = pathModule.extname(filePath).toLowerCase();
  let mimeType = 'text/html'; // default

  switch (ext) {
    case '.js':
      mimeType = 'application/javascript';
      break;
    case '.css':
      mimeType = 'text/css';
      break;
    case '.json':
      mimeType = 'application/json';
      break;
    case '.png':
      mimeType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      mimeType = 'image/jpeg';
      break;
    case '.svg':
      mimeType = 'image/svg+xml';
      break;
    case '.ico':
      mimeType = 'image/x-icon';
      break;
    case '.woff':
      mimeType = 'font/woff';
      break;
    case '.woff2':
      mimeType = 'font/woff2';
      break;
    case '.ttf':
      mimeType = 'font/ttf';
      break;
    case '.eot':
      mimeType = 'application/vnd.ms-fontobject';
      break;
    default:
      mimeType = 'text/html';
      break;
  }

  return { mimeType, ext };
};
