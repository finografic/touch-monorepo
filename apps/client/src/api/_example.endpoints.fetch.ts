import { EndpointHelper, useEndpointQuery } from 'api/api.endpoints';

// Example of a rate-limited endpoint with custom retry logic
export const useGetAnalytics = (params: { from: Date; to: Date }) => {
  return useEndpointQuery(
    ['analytics', params.from.toISOString(), params.to.toISOString()],
    () => EndpointHelper.getAnalytics(params),
    {
      maxRetries: 5,
      retryDelay: 60000, // 1 minute between retries for rate-limited endpoint
      enabled: !!params.from && !!params.to,
    },
  );
};

// Example usage in a hook with the new utility
export const useGetDrinkType = (id: string) => {
  return useEndpointQuery(['drinkType', id], () => EndpointHelper.getDrinkType(id), {
    maxRetries: 2,
    enabled: !!id,
  });
};
