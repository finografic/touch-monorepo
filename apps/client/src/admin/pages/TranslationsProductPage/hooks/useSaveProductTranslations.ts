import { useCallback } from 'react';
import type { RegionLocale } from '@workspace/config/i18n.config';

import {
  useCreateDrinkType,
  useUpdateDrinkType,
  useCreateDrinkSubtype,
  useUpdateDrinkSubtype,
} from 'queries/drink-types';
import { useCreateVolume, useUpdateVolume } from 'queries/drink-volumes';
import { useCreateContainerType, useUpdateContainerType } from 'queries/container-types';

import type { SectionKey, TranslationFormItem } from '../translations.types';
import { TranslationsDto } from '../utils/translations.dto';
import { useToast } from 'components/Toast/ToastContext';
import { invalidateReferenceDataQueries } from 'queries/invalidateReferenceData';
import { useQueryClient } from '@tanstack/react-query';

export const useSaveProductTranslations = (sectionKey: SectionKey, supportedLanguages: RegionLocale[]) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createDrinkType = useCreateDrinkType();
  const updateDrinkType = useUpdateDrinkType();
  const createDrinkSubtype = useCreateDrinkSubtype();
  const updateDrinkSubtype = useUpdateDrinkSubtype();

  const createVolume = useCreateVolume();
  const updateVolume = useUpdateVolume();

  const createContainerType = useCreateContainerType();
  const updateContainerType = useUpdateContainerType();

  const save = useCallback(
    async ({ items }: { items: TranslationFormItem[] }) => {
      const created: TranslationFormItem[] = [];
      const updated: TranslationFormItem[] = [];

      for (const item of items) {
        const payload = TranslationsDto.toApi(item, supportedLanguages);

        // CREATE
        if (item.id.startsWith('temp-')) {
          let entity: any;

          switch (sectionKey) {
            case 'drinkTypes':
              entity = await createDrinkType.mutateAsync({
                name: payload.name,
                translations: payload.translations,
                hasSubtypes: (item as any).hasSubtypes ?? false,
                defaultTempConsume: (item as any).defaultTempConsume ?? 5,
                defaultTempFreeze: (item as any).defaultTempFreeze ?? -2,
              });
              break;

            case 'volumes':
              entity = await createVolume.mutateAsync({
                name: payload.name,
                translations: payload.translations,
                valueInMl: (item as any).valueInMl ?? 330,
                sortOrder: (item as any).sortOrder ?? 0,
                coolingFactor: (item as any).coolingFactor ?? 1,
              });
              break;

            case 'containerTypes':
              entity = await createContainerType.mutateAsync({
                name: payload.name,
                translations: payload.translations,
                thermalConductivity: (item as any).thermalConductivity ?? 1,
              });
              break;

            case 'drinkSubtypes': {
              const drinkTypeId = (item as any).drinkTypeId;
              if (!drinkTypeId) throw new Error('drinkTypeId required');

              entity = await createDrinkSubtype.mutateAsync({
                name: payload.name,
                drinkTypeId,
                translations: payload.translations,
                defaultTempConsume: (item as any).defaultTempConsume ?? 5,
                defaultTempFreeze: (item as any).defaultTempFreeze ?? -2,
              });
              break;
            }

            default:
              throw new Error(`Unsupported section: ${sectionKey}`);
          }

          created.push({ ...item, id: entity.id });
          continue;
        }

        // UPDATE (ONLY items passed in)
        switch (sectionKey) {
          case 'drinkTypes':
            await updateDrinkType.mutateAsync({
              id: item.id,
              updates: {
                name: payload.name,
                translations: payload.translations,
                hasSubtypes: (item as any).hasSubtypes,
                defaultTempConsume: (item as any).defaultTempConsume,
                defaultTempFreeze: (item as any).defaultTempFreeze,
              },
            });
            break;

          case 'volumes':
            await updateVolume.mutateAsync({
              id: item.id,
              updates: {
                name: payload.name,
                translations: payload.translations,
                valueInMl: (item as any).valueInMl,
                sortOrder: (item as any).sortOrder,
                coolingFactor: (item as any).coolingFactor,
              },
            });
            break;

          case 'containerTypes':
            await updateContainerType.mutateAsync({
              id: item.id,
              updates: {
                name: payload.name,
                translations: payload.translations,
                thermalConductivity: (item as any).thermalConductivity,
              },
            });
            break;

          case 'drinkSubtypes': {
            const drinkTypeId = (item as any).drinkTypeId;
            if (!drinkTypeId) throw new Error('drinkTypeId required');

            await updateDrinkSubtype.mutateAsync({
              id: item.id,
              drinkTypeId,
              updates: {
                name: payload.name,
                translations: payload.translations,
                defaultTempConsume: (item as any).defaultTempConsume,
                defaultTempFreeze: (item as any).defaultTempFreeze,
              },
            });
            break;
          }

          default:
            throw new Error(`Unsupported section: ${sectionKey}`);
        }

        updated.push(item);
      }

      if (created.length || updated.length) {
        toast({
          variant: 'success',
          message: `Saved ${created.length} created, ${updated.length} updated`,
        });
      }

      await invalidateReferenceDataQueries(queryClient);

      return {
        savedItems: [...created, ...updated],
      };
    },
    [
      sectionKey,
      supportedLanguages,
      createDrinkType,
      updateDrinkType,
      createDrinkSubtype,
      updateDrinkSubtype,
      createVolume,
      updateVolume,
      createContainerType,
      updateContainerType,
      toast,
    ],
  );

  return {
    save,
    isLoading:
      createDrinkType.isPending ||
      updateDrinkType.isPending ||
      createDrinkSubtype.isPending ||
      updateDrinkSubtype.isPending ||
      createVolume.isPending ||
      updateVolume.isPending ||
      createContainerType.isPending ||
      updateContainerType.isPending,
  };
};
