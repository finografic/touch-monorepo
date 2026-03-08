import type { ContainerType } from './container.model';
import type { DrinkType } from './drink-type.model';
import type { DrinkVolume } from './volume.model';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  category?: string;
}

interface Translatable {
  name: string;
  translations?: Record<string, string> | null;
}

export class SelectOptionDto {
  private static getTranslatedLabel(entity: Translatable, language: string = 'es-ES'): string {
    const translations = entity.translations;
    if (translations && typeof translations === 'object') {
      return translations[language] || entity.name || '';
    }
    return entity.name || '';
  }

  static fromDrinkTypes(drinkTypes: DrinkType[], language: string = 'es-ES'): SelectOption[] {
    return drinkTypes
      .map((dt) => ({
        value: dt.name || '',
        label: this.getTranslatedLabel(dt, language),
        category: 'Database',
        description: `Drink type: ${this.getTranslatedLabel(dt, language)}`,
      }))
      .filter((option) => option.value);
  }

  static fromVolumes(volumes: DrinkVolume[], language: string = 'es-ES'): SelectOption[] {
    return volumes
      .map((vol) => ({
        value: vol.name || '',
        label: this.getTranslatedLabel(vol, language),
        category: 'Database',
        description: `Volume: ${this.getTranslatedLabel(vol, language)}`,
      }))
      .filter((option) => option.value);
  }

  static fromContainerTypes(
    containerTypes: ContainerType[],
    language: string = 'es-ES',
  ): SelectOption[] {
    return containerTypes
      .map((ct) => ({
        value: ct.name || '',
        label: this.getTranslatedLabel(ct, language),
        category: 'Database',
        description: `Container: ${this.getTranslatedLabel(ct, language)}`,
      }))
      .filter((option) => option.value);
  }

  static fromCustomItems(items: string[], category: string = 'Custom'): SelectOption[] {
    return items.map((item) => ({
      value: item,
      label: item,
      category,
      description: `${category}: ${item}`,
    }));
  }

  static fromOrdersData(orders: any[], field: string, filters: Record<string, string> = {}): SelectOption[] {
    const filteredOrders = orders.filter((order) => {
      return Object.entries(filters).every(([key, value]) => !value || order[key] === value);
    });

    const uniqueValues = [...new Set(filteredOrders.map((order) => order[field]).filter(Boolean))];

    return uniqueValues.map((value) => ({
      value,
      label: value,
      category: 'From existing orders',
      description: `Used in ${filteredOrders.filter((o) => o[field] === value).length} orders`,
    }));
  }

  static mergeOptions(...optionArrays: SelectOption[][]): SelectOption[] {
    const allOptions = optionArrays.flat();
    const uniqueOptions = Array.from(new Map(allOptions.map((opt) => [opt.value, opt])).values());

    return uniqueOptions.sort((a, b) => {
      const categoryPriority = { 'Database': 0, 'From existing orders': 1, 'Custom': 2 };
      const aPriority = categoryPriority[a.category as keyof typeof categoryPriority] ?? 3;
      const bPriority = categoryPriority[b.category as keyof typeof categoryPriority] ?? 3;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return a.label.localeCompare(b.label);
    });
  }
}
