import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Flex } from '@radix-ui/themes';
import { useOrders } from 'providers/OrdersProvider';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { useFilters } from 'hooks/useFilters';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useGetMinMaxTemperatures } from 'queries/temperature/useGetMinMaxTemperatures';
import { useGetTemperatureProfiles } from 'queries/temperature/useGetTemperatureProfiles';
import { findClosestProfile } from 'utils/temperature.utils';
import { stylesAppContent } from 'styles/custom/content.app.styles';
import { styles } from './TemperaturePage.styles';

interface TemperatureFormData {
  initial: number;
  final: number;
}

const INITIAL_TEMP_DEFAULT = 25;
const FINAL_TEMP_DEFAULT = 3;
const MIN_TEMP_DIFFERENCE = 5;

const DESCRIPTIONS = {
  initial: {
    label: 'temperatura inicial',
    description: 'por defecto, la temperatura ambiente suministrada',
  },
  final: {
    label: 'temperatura final',
    description: 'por defecto, la temperatura de consumo recomendada',
  },
  page: 'By default, it indicates the ambient temperature supplied by a probe. The user can modify it using the + and - buttons. Units are in degrees Celsius with one decimal place.',
} as const;

export const TemperaturePage = () => {
  const { orders, setOrdersFilter } = useOrders();
  const { currentSessionId, updateSessionFilters } = useSession();
  const { dataFiltered, setFilter } = useFilters();
  const { setIsNextDisabled } = usePagination();
  const { fieldKey } = useRouteConfig();

  // Get min and max allowed temperatures
  const {
    data: minMaxTemperatures,
    isLoading: isLoadingTemperatures,
    error: minMaxError,
  } = useGetMinMaxTemperatures();

  // Get temperature profiles
  const temperatureProfilesQuery = useGetTemperatureProfiles({
    orderId: orders[0]?.id,
    enabled: Boolean(orders[0]?.id),
  });

  const profiles = temperatureProfilesQuery.data ?? [];
  const isLoadingProfiles = temperatureProfilesQuery.isLoading;
  const profilesError = temperatureProfilesQuery.error;

  // Find closest profile for display
  const closestProfile =
    profiles.length > 0 ? findClosestProfile(profiles, INITIAL_TEMP_DEFAULT, FINAL_TEMP_DEFAULT) : null;

  // Get default consumption temperature from filtered data
  const defaultTempConsume = dataFiltered?.[0]?.defaultTempConsume ?? FINAL_TEMP_DEFAULT;
  const defaultTempFreeze = dataFiltered?.[0]?.defaultTempFreeze ?? 0;

  // Initialize form with existing values or defaults
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TemperatureFormData>({
    defaultValues: {
      initial: INITIAL_TEMP_DEFAULT,
      final: defaultTempConsume,
    },
  });

  const watchedInitial = watch('initial');
  const watchedFinal = watch('final');

  // Update Next button state based on temperature difference
  const updateNextButtonState = useCallback(() => {
    const isValid = watchedFinal < watchedInitial - MIN_TEMP_DIFFERENCE;
    setIsNextDisabled(!isValid);
  }, [watchedInitial, watchedFinal, setIsNextDisabled]);

  // Update filters when temperatures change
  const updateFilters = useCallback(
    (initial: number, final: number) => {
      const lookup = { initial, final, name: `${initial}°C → ${final}°C` };

      // Update order filters
      const sessionOrders = orders.filter((order) => order.session?.id === currentSessionId);
      for (const order of sessionOrders) {
        const currentFilters = order.filters || {};
        setOrdersFilter({
          itemNumber: order.itemNumber,
          filter: { ...currentFilters, [fieldKey]: { initial, final, lookup } },
        });
      }

      // Update session filters
      if (currentSessionId) {
        const prevSessionFilters = orders.find((o) => o.session?.id === currentSessionId)?.filters || {};
        const sessionFilters = {
          ...prevSessionFilters,
          [fieldKey]: { initial, final, lookup },
        };
        updateSessionFilters(currentSessionId, sessionFilters);
      }

      // 🎯 CRITICAL: Update global filters (this was missing!)
      setFilter(fieldKey, { initial, final, lookup });
      console.log('🔍 TEMP CHANGE: Global filters updated:', { initial, final });
    },
    [orders, currentSessionId, fieldKey, setOrdersFilter, updateSessionFilters, setFilter],
  );

  // Handle temperature changes
  const handleTemperatureChange = useCallback(
    (field: 'initial' | 'final', value: number) => {
      setValue(field, value);

      // Auto-adjust final temperature if initial goes below it
      if (field === 'initial' && value <= watchedFinal) {
        const newFinal = Math.max(defaultTempFreeze, value - MIN_TEMP_DIFFERENCE);
        setValue('final', newFinal);
        updateFilters(value, newFinal);
      } else {
        updateFilters(field === 'initial' ? value : watchedInitial, field === 'final' ? value : watchedFinal);
      }

      updateNextButtonState();
    },
    [setValue, watchedInitial, watchedFinal, defaultTempFreeze, updateFilters, updateNextButtonState],
  );

  // Form submit handler
  const onSubmit = useCallback(
    (data: TemperatureFormData) => {
      console.log('Temperature form submitted:', data);

      // 🎯 CRITICAL: Sync final form values to global filters before START button reads them
      const lookup = {
        initial: data.initial,
        final: data.final,
        name: `${data.initial}°C → ${data.final}°C`,
      };

      // Update global filters with final form values
      setFilter(fieldKey, { initial: data.initial, final: data.final, lookup });
      console.log('🔍 FORM SUBMIT: Global filters updated with final form values:', {
        initial: data.initial,
        final: data.final,
      });

      // The actual temperature control logic will be handled by the START button in useButtonOperations
      // This form just ensures the data is properly set in all filter systems
    },
    [fieldKey, setFilter],
  );

  // Update Next button state when temperatures change
  useEffect(() => {
    updateNextButtonState();
  }, [updateNextButtonState]);

  // TODO: MOCK_DATA_FIX - Initialize global filters when form loads
  // This ensures useTemperatureControl can find the temperature values even if user doesn't change them
  useEffect(() => {
    console.log('🔍 INIT EFFECT: Starting temperature filter initialization...');
    console.log('🔍 INIT EFFECT: currentSessionId:', currentSessionId);
    console.log('🔍 INIT EFFECT: orders.length:', orders.length);
    console.log('🔍 INIT EFFECT: fieldKey:', fieldKey);

    if (currentSessionId && orders.length > 0) {
      // Check if we have existing temperature filters in the current session
      const sessionOrders = orders.filter((order) => order.session?.id === currentSessionId);
      console.log('🔍 INIT EFFECT: sessionOrders:', sessionOrders);

      if (sessionOrders.length > 0) {
        const existingTempFilter = sessionOrders[0].filters?.[fieldKey];
        console.log('🔍 INIT EFFECT: existingTempFilter:', existingTempFilter);

        if (
          existingTempFilter &&
          typeof existingTempFilter === 'object' &&
          'initial' in existingTempFilter &&
          'final' in existingTempFilter
        ) {
          // Use existing temperature values from session filters
          const initial = (existingTempFilter as any).initial ?? INITIAL_TEMP_DEFAULT;
          const final = (existingTempFilter as any).final ?? defaultTempConsume;
          console.log('🔍 INIT EFFECT: Using existing session values:', { initial, final });

          // Initialize global filters so useTemperatureControl can find them
          const lookup = { initial, final, name: `${initial}°C → ${final}°C` };
          setFilter(fieldKey, { initial, final, lookup });
          console.log('🔍 INIT EFFECT: Global filters updated with session values');
        } else {
          // Initialize with default values
          console.log('🔍 INIT EFFECT: Using default values:', {
            initial: INITIAL_TEMP_DEFAULT,
            final: defaultTempConsume,
          });
          const lookup = {
            initial: INITIAL_TEMP_DEFAULT,
            final: defaultTempConsume,
            name: `${INITIAL_TEMP_DEFAULT}°C → ${defaultTempConsume}°C`,
          };
          setFilter(fieldKey, { initial: INITIAL_TEMP_DEFAULT, final: defaultTempConsume, lookup });
          console.log('🔍 INIT EFFECT: Global filters updated with default values');
        }
      } else {
        console.log('🔍 INIT EFFECT: No session orders found, using defaults');
        const lookup = {
          initial: INITIAL_TEMP_DEFAULT,
          final: defaultTempConsume,
          name: `${INITIAL_TEMP_DEFAULT}°C → ${defaultTempConsume}°C`,
        };
        setFilter(fieldKey, { initial: INITIAL_TEMP_DEFAULT, final: defaultTempConsume, lookup });
        console.log('🔍 INIT EFFECT: Global filters updated with defaults (no session)');
      }
    } else {
      console.log('🔍 INIT EFFECT: No session or orders, using defaults');
      const lookup = {
        initial: INITIAL_TEMP_DEFAULT,
        final: defaultTempConsume,
        name: `${INITIAL_TEMP_DEFAULT}°C → ${defaultTempConsume}°C`,
      };
      setFilter(fieldKey, { initial: INITIAL_TEMP_DEFAULT, final: defaultTempConsume, lookup });
      console.log('🔍 INIT EFFECT: Global filters updated with defaults (no session/orders)');
    }
  }, [currentSessionId, orders, fieldKey, defaultTempConsume, setFilter]);

  // Don't show inputs until we have the temperature constraints and default values
  if ((isLoadingTemperatures && !minMaxError) || isLoadingProfiles) {
    return (
      <Flex css={stylesAppContent} className="temperature-content" gap="3" direction="column">
        <Box>Loading temperature settings...</Box>
      </Flex>
    );
  }

  if (profilesError) {
    return (
      <Flex css={stylesAppContent} className="temperature-content" gap="3" direction="column">
        <Box>Error loading temperature profiles.</Box>
      </Flex>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex css={stylesAppContent} className="temperature-content" gap="3" direction="column">
        <Flex direction="column" gap="3" justify="center" css={styles}>
          <Flex gap="3" justify="center" className="page-description">
            <Box>
              <p style={{ textAlign: 'center' }}>{DESCRIPTIONS.page}</p>
              {closestProfile !== null && (
                <>
                  <div style={{ color: 'orange', marginTop: 8, textAlign: 'center' }}>
                    Closest available profile: {closestProfile.temperature}°C
                  </div>
                  <div
                    style={{
                      color: 'orange',
                      opacity: 0.6,
                      marginTop: 4,
                      textAlign: 'center',
                      fontSize: '0.7em',
                    }}
                  >
                    Available profiles: [
                    {profiles.map((p, i) => (
                      <span key={p.id}>
                        {p.temperature}
                        {i < profiles.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                    ]
                  </div>
                </>
              )}
            </Box>
          </Flex>

          <Flex gap="3" justify="center" className="temperature-content">
            <Box>
              <label
                htmlFor="initial-temp"
                style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}
              >
                {DESCRIPTIONS.initial.label}
              </label>
              <input
                id="initial-temp"
                type="number"
                step="0.5"
                min={watchedFinal + MIN_TEMP_DIFFERENCE}
                max={minMaxTemperatures?.max ?? 50}
                {...register('initial', {
                  required: true,
                  min: watchedFinal + MIN_TEMP_DIFFERENCE,
                  max: minMaxTemperatures?.max ?? 50,
                  onChange: (e) => handleTemperatureChange('initial', Number.parseFloat(e.target.value) || 0),
                })}
                style={{
                  width: '120px',
                  padding: '0.5rem',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid #3b82f6',
                  borderRadius: '8px',
                }}
              />
              {errors.initial && (
                <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.initial.message}
                </div>
              )}
            </Box>

            <Box>
              <label
                htmlFor="final-temp"
                style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}
              >
                {DESCRIPTIONS.final.label}
              </label>
              <input
                id="final-temp"
                type="number"
                step="0.5"
                min={defaultTempFreeze}
                max={watchedInitial - MIN_TEMP_DIFFERENCE}
                {...register('final', {
                  required: true,
                  min: defaultTempFreeze,
                  max: watchedInitial - MIN_TEMP_DIFFERENCE,
                  onChange: (e) => handleTemperatureChange('final', Number.parseFloat(e.target.value) || 0),
                })}
                style={{
                  width: '120px',
                  padding: '0.5rem',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid #3b82f6',
                  borderRadius: '8px',
                }}
              />
              {errors.final && (
                <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.final.message}
                </div>
              )}
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </form>
  );
};
