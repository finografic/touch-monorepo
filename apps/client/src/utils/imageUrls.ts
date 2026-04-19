/**
 * Public URL for an uploaded image served by the API (same-origin; Vite proxies `/api` in dev).
 */
export const getImageFilePublicUrl = (filePath: string): string => {
  return `/api/images/files/${encodeURIComponent(filePath)}`;
};
