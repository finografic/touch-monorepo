export type ImageCategory = 'product' | 'label';

export interface ImageFile {
  id: string;
  name: string;
  originalName?: string;
  url: string;
  filePath?: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface ImageSettings {
  product: string | null;
  label: string | null;
}
