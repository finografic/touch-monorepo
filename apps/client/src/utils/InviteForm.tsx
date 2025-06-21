import { Col, Row } from 'react-grid-system';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { matchSorter } from 'match-sorter';
import type { DataEntry } from 'types';
import { METADATA } from 'types';
import { useGetMetadata } from 'api/useGetMetadata';
import { useDataFilter } from 'store/DataFilterContext';
import { DataSearch } from 'components/DataSearch';
import { DetailFilter } from 'components/DetailFilter';
import type { SelectOption } from 'forms/FormUI/Select';
import { Select } from 'forms/FormUI/Select';
import { usePagination } from 'components/Pagination';
import 'react-datepicker/dist/react-datepicker.css';
import { slugify } from 'utils/string.utils';
import { SPAIN_PROVINCES } from 'forms/config/form.select-options/spain/spain.select-options';
import { RESET } from './invite-form.contants';
import { useInviteFilters } from '../InviteFiltersContext';
import { Summary } from '../invitesDEV';
import { styles } from './InviteForm.styles';

export const InviteForm = ({ setSelectedIDs }: any) => {
  const { selectedIDs } = usePagination();

  // DATA + FILTERS
  const { setDataFilter, ...dataFilter } = useDataFilter();
  const { data, dataFiltered, results } = dataFilter;
  const { setFilters, ...filters } = useInviteFilters();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // FORM VALUES
  const formMethods = useFormContext();
  const { register, setValue } = formMethods;

  // ------------------------------------------------------------------------- //

  // FORM UI
  const [entityTypeOptions, setEntityTypeOptions] = useState<SelectOption[]>([]);

  const [selectedLocations, setSelectedLocations] = useState<SelectOption[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<SelectOption[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(true);

  // ------------------------------------------------------------------------- //

  // DATA RESULTS
  const [searchResults, setSearchResults] = useState<DataEntry[]>([]);

  // ------------------------------------------------------------------------- //

  useEffect(() => {
    if (isInitialized) {
      setSelectedIDs(selectedIDs);
    }
  }, [selectedIDs]);

  // ------------------------------------------------------------------------- //

  useGetMetadata({
    meta_key: METADATA.entity_type,
    onSuccess: (res) => {
      const options = res.map((item: string) => ({ value: item, label: item }));
      setEntityTypeOptions(options);
    },
  });

  // ------------------------------------------------------------------------- //

  const getMatchingOptions = ({
    options,
    query = '',
    filterByKeys = ['value', 'label'],
  }: {
    options: any[];
    query: string | number | boolean;
    filterByKeys?: string[];
  }) => {
    const matches = [
      ...matchSorter(options, String(query), {
        keys: [filterByKeys].flat(),
        // threshold: matchSorter.rankings.MATCHES, // (default)
        // threshold: matchSorter.rankings.CONTAINS,
        // threshold: matchSorter.rankings.STARTS_WITH,
        threshold: matchSorter.rankings.WORD_STARTS_WITH, // <== BEST!!
        baseSort: (a, b) => (a.index < b.index ? -1 : 1),
      }),
    ];

    return matches;
  };

  const hasMatchingOption = (dataset: any[], query: SelectOption | string, byKey?: string) => {
    const target = { value: '', label: '' };
    if (typeof query === 'string') {
      target.value = query;
      target.label = query;
    } else {
      target.value = query.value;
      target.label = query.label || query.value;
    }
    /* eslint-disable prettier/prettier */
    return byKey
      ? !!dataset.find(
          (source) =>
            !!(
              slugify(`${source[byKey]}`) === slugify(`${target?.value}`) ||
              slugify(`${source[byKey]}`) === slugify(`${target?.label}`)
            ),
        )
      : !!dataset.find(
          (source) =>
            !!(
              slugify(`${source.value}`) === slugify(`${target?.value}`) ||
              slugify(`${source.label}`) === slugify(`${target?.label}`) ||
              slugify(`${source.value}`) === slugify(`${target?.label}`) ||
              slugify(`${source.label}`) === slugify(`${target?.value}`)
            ),
        );
    /* eslint-enable prettier/prettier */
  };

  // ------------------------------------------------------------------------- //

  const OPTIONS_LOCATION: SelectOption[] = [];

  SPAIN_PROVINCES.map((province: SelectOption) => {
    if (hasMatchingOption(dataFiltered, province, 'province')) {
      OPTIONS_LOCATION.push({ value: province.value, label: province.label });
    }
  });

  // NEW: SET ALL FILTERS =================================================== //

  const applyFilters = (dataToFilter: DataEntry[]) => {
    if (!isBusy) setIsBusy(true);

    let resultsFiltered = results;

    if (filters.province.isActive) {
      resultsFiltered = resultsFiltered.filter((result: DataEntry) =>
        hasMatchingOption(selectedLocations, String(result?.province)),
      );
    }
    if (filters.entityType.isActive) {
      resultsFiltered = resultsFiltered.filter((result: DataEntry) =>
        hasMatchingOption(selectedTypes, String(result?.entity_type)),
      );
    }

    setDataFilter({ results: resultsFiltered });
    setIsBusy(false);

    return resultsFiltered;
  };

  // ======================================================================== //

  const handleSelectLocation = (selection: string | null) => {
    if (Array.isArray(selection) && selection.length === 0) {
      /* eslint-disable prettier/prettier */
      const province = { value: '', label: '', isActive: false };
      setSelectedLocations([]);
      setValue('province', []);
      setFilters({ province });
    } else {
      const match = getMatchingOptions({ options: SPAIN_PROVINCES, query: `${selection}` })[0];
      /* eslint-disable prettier/prettier */
      const province =
        match?.value && filters.province?.value
          ? { value: match.value, label: match.label, isActive: filters.province.isActive }
          : match?.value
            ? { value: match.value, label: match.label, isActive: true }
            : RESET.LOCATIONS;
      /* eslint-enable prettier/prettier */
      setSelectedLocations([{ value: match?.value, label: match?.label } as SelectOption]);
      setValue('province', { ...province });
      setFilters({ province });
    }
  };

  const handleSelectType = (selection: string | null) => {
    if (Array.isArray(selection) && selection.length === 0) {
      const entityType = { value: '', label: '', isActive: false };
      setSelectedTypes([]);
      setValue('entityType', []);
      setFilters({ entityType });
    } else {
      const entityType = { value: String(selection), label: String(selection) };
      setSelectedTypes([entityType]);
      setValue('entityType', { ...entityType, isActive: !!selection });
      setFilters({ entityType: { ...entityType, isActive: !!selection } });
    }
  };

  // ======================================================================== //
  // INIT DATA ============================================================== //
  // ======================================================================== //

  // ✅ 1. INITIALIZE - WITH MAIN FILTER
  useEffect(() => {
    setDataFilter({ dataFiltered: data });
    setIsBusy(false);
    setIsInitialized(true);
  }, [data]);

  // ✅ 2. APPLY FILTERS TO DATA (WITHIN CURRENT DATE_RANGE)
  useEffect(() => {
    if (!isBusy && dataFiltered.length > 0) {
      applyFilters(dataFiltered); // ⚠️ TODO: UN-COMMENT !!!
    }
  }, [dataFiltered]);

  // ======================================================================== //
  //  USER FILTERS ========================================================== //
  // ======================================================================== //

  useEffect(() => {
    if (!isBusy) {
      setIsBusy(true);
      if (filters.province.isActive) {
        setDataFilter({ dataFiltered: applyFilters(data) });
      } else {
        setDataFilter({ dataFiltered: data });
      }
      setIsBusy(false);
    }
  }, [filters.province]);

  useEffect(() => {
    if (!isBusy) {
      setIsBusy(true);
      if (filters.entityType.isActive) {
        setDataFilter({ dataFiltered: applyFilters(data) });
      } else {
        setDataFilter({ dataFiltered: data });
      }
      setIsBusy(false);
    }
  }, [filters.entityType]);

  // SEARCH QUERY =========================================================== //
  // RESET / CLEAR HERO DATA STORED FOR DETAIL PAGE

  useEffect(() => {
    if (filters.searchQuery.isActive) {
      setDataFilter({ results: searchResults || dataFiltered });
    } else {
      setDataFilter({ results: dataFiltered });
    }
  }, [filters.searchQuery.isActive, dataFiltered, searchResults]);

  // ======================================================================== //

  // 1. view // 2. email // 3. añadir

  return (
    <section css={styles}>
      {/* {isBusy && <Spinner page />} */}
      <Row>
        <Col xs={12}>
          <form id="form-eventos">
            <input role="presentation" autoComplete="off" style={{ display: 'none' }} />
            {/* [ ✅ ] FILTERS ---------------------------------------- */}
            <Row align="center">
              <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4} className="col col-filters">
                <fieldset className="fieldset-filter">
                  <label htmlFor="field__province">Provincia</label>
                  <Select
                    id="field__province"
                    {...register('province')}
                    aria-label="Provincia"
                    isClearable={true}
                    isSearchable={true}
                    isMulti={false}
                    isDisabled={false}
                    options={OPTIONS_LOCATION}
                    onChange={handleSelectLocation}
                    value={filters.province.value}
                    placeholder={`Todas provincias (${OPTIONS_LOCATION.length})...`}
                  />
                </fieldset>
              </Col>
              {/* ---------------------------------------------------------- */}
              <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4} className="col col-filters">
                <fieldset className="fieldset-type">
                  <label htmlFor="field__entityType">Tipo de Entidad</label>
                  {entityTypeOptions.length > 0 && (
                    <Select
                      id="field__entityType"
                      {...register('entityType')}
                      aria-label="entityType"
                      isClearable={true}
                      isSearchable={true}
                      isMulti={false}
                      isDisabled={false}
                      options={entityTypeOptions}
                      onChange={handleSelectType}
                      value={filters.entityType.value}
                      placeholder={'Tipo de entitidad'}
                    />
                  )}
                </fieldset>
              </Col>
              {/* ---------------------------------------------------------- */}
              <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4} className="col col-search">
                <fieldset className="fieldset-filter">
                  <label htmlFor="field__search">Buscar</label>
                  <DetailFilter
                    field={'searchQuery'}
                    initValue={{ value: filters.searchQuery.value, isActive: false }}
                    filtersState={{ filters, setFilters }}
                  >
                    <DataSearch
                      filterByKeys={['name']}
                      data={dataFiltered}
                      searchQuery={filters.searchQuery.value || ''}
                      setSearchQuery={(value: string) => {
                        const hasQuery = value.length >= 3;
                        setValue('searchQuery.value', value);
                        setValue('searchQuery.isActive', hasQuery);
                        setFilters({ searchQuery: { value, isActive: hasQuery } });
                      }}
                      setSearchResults={(payload: unknown) => log('log only (deprecated)', 'grey', payload)}
                      searchResults={results}
                      placeholder="Buscar eventos filtrados..."
                      isDisabled={false}
                    />
                  </DetailFilter>
                </fieldset>
              </Col>
            </Row>
            {/* ---------------------------------------------------------- */}
          </form>
        </Col>
      </Row>
    </section>
  );
};
