export interface TranslationsModel {
  id: string;
  key: string;
  translations: Record<string, string>;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}
