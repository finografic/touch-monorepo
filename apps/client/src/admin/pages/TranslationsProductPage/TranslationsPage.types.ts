export type SectionKey = 'drinkSubtypes' | 'volumes' | 'drinkTypes' | 'containerTypes';

export interface TranslationItem {
  id: string | null;
  name: string;
  esEs: string;
  enGb: string;
  caEs: string;
}
