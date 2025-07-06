export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  category?: string;
}

export interface DrinkTypeEntity {
  id: string;
  name: string;
  translations?: Record<string, string>;
}

export interface VolumeEntity {
  id: string;
  name: string;
  translations?: Record<string, string>;
}

export interface ContainerTypeEntity {
  id: string;
  name: string;
  translations?: Record<string, string>;
}

export class SelectOptionDto {
  /**
   * Get translated label from entity, falling back to name
   */
  private static getTranslatedLabel(
    entity: DrinkTypeEntity | VolumeEntity | ContainerTypeEntity,
    language: string = 'es-ES',
  ): string {
    const translations = entity.translations;
    if (translations && typeof translations === 'object') {
      return translations[language] || entity.name || '';
    }
    return entity.name || '';
  }

  /**
   * Transform DrinkType entities to SelectOptions
   */
  static fromDrinkTypes(drinkTypes: DrinkTypeEntity[], language: string = 'es-ES'): SelectOption[] {
    return drinkTypes
      .map((dt) => ({
        value: dt.name || '',
        label: this.getTranslatedLabel(dt, language),
        category: 'Database',
        description: `Drink type: ${this.getTranslatedLabel(dt, language)}`,
      }))
      .filter((option) => option.value);
  }

  /**
   * Transform Volume entities to SelectOptions
   */
  static fromVolumes(volumes: VolumeEntity[], language: string = 'es-ES'): SelectOption[] {
    return volumes
      .map((v) => ({
        value: v.name || '',
        label: this.getTranslatedLabel(v, language),
        category: 'Database',
        description: `Volume: ${this.getTranslatedLabel(v, language)}`,
      }))
      .filter((option) => option.value);
  }

  /**
   * Transform ContainerType entities to SelectOptions
   */
  static fromContainerTypes(
    containerTypes: ContainerTypeEntity[],
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

  /**
   * Transform custom/temp items to SelectOptions
   */
  static fromCustomItems(items: string[], category: string = 'Custom'): SelectOption[] {
    return items.map((item) => ({
      value: item,
      label: item,
      category,
      description: `${category}: ${item}`,
    }));
  }

  /**
   * Transform orders data to SelectOptions for progressive filtering
   */
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

  /**
   * Merge multiple SelectOption arrays and remove duplicates
   */
  static mergeOptions(...optionArrays: SelectOption[][]): SelectOption[] {
    const allOptions = optionArrays.flat();
    const uniqueOptions = Array.from(new Map(allOptions.map((opt) => [opt.value, opt])).values());

    // Sort by category priority, then alphabetically
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
