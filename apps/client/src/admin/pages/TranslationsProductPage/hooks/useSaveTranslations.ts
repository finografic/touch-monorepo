import type { TranslationFormItem, SectionKey } from 'admin/pages/TranslationsProductPage/translations.types';
import { TranslationsDto } from '../translations.dto';
import type { RegionLocale } from 'node_modules/@workspace/i18n/dist/_tsup-dts-rollup';
import { useToast } from 'components/Toast/ToastContext';

export const useSaveTranslations = (sectionKey: SectionKey, supportedLanguages: RegionLocale[]) => {
  const { toast } = useToast();

  const save = async (items: TranslationFormItem[]) => {
    const toCreate = items.filter((i) => i.id.startsWith('temp-'));
    const toUpdate = items.filter((i) => !i.id.startsWith('temp-'));

    // 🔹 CREATE
    for (const item of toCreate) {
      const payload = TranslationsDto.toApi(item, supportedLanguages);

      switch (sectionKey) {
        case 'drinkTypes':
          await createDrinkType.mutateAsync(payload);
          break;
        case 'volumes':
          await createVolume.mutateAsync(payload);
          break;
        // TODO: etc..
        // ...
      }

      // TODO: ADD TOAST MESSAGES ON REPONSE..
      // toast({
      //   variant: 'error',
      //   message: errorMessage,
      // });
    }

    // 🔹 UPDATE
    for (const item of toUpdate) {
      const payload = TranslationsDto.toApi(item, supportedLanguages);

      switch (sectionKey) {
        case 'drinkTypes':
          await updateDrinkType.mutateAsync({
            id: item.id,
            ...payload,
          });
          break;
        case 'volumes':
          await updateVolume.mutateAsync({
            id: item.id,
            ...payload,
          });
          break;
        // TODO: etc..
        // ...
      }
    }
  };

  return { save };
};
