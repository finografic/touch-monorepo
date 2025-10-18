import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';
import { ORDERS_READABLE_QUERY_KEYS } from 'queries/orders';

/**
 * Hook to update temperature profiles for an order
 * Handles create, update, and delete operations
 */
export const useUpdateTemperatureProfiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      profiles,
      existingProfiles = [],
    }: {
      orderId: string;
      profiles: Array<{
        id?: string;
        temperature: number;
        timeA: number;
        timeB: number;
        timeC: number;
      }>;
      existingProfiles?: Array<{
        id: string;
        temperature: number;
        timeA: number;
        timeB: number;
        timeC: number;
        modeId: string;
      }>;
    }): Promise<any> => {
      try {
        // Step 1: Determine which profiles to delete
        const newProfileIds = profiles.map((p) => p.id).filter(Boolean);
        const profilesToDelete = existingProfiles.filter((existing) => !newProfileIds.includes(existing.id));

        // Step 2: Delete removed profiles
        const deletePromises = profilesToDelete.map(async (profile) => {
          console.log('Deleting temperature profile:', profile.id);
          return await api.delete(`/temperature-profiles/${profile.id}`);
        });

        // Step 3: Update existing profiles and create new ones
        const upsertPromises = profiles.map(async (profile, index) => {
          if (profile.id) {
            // Update existing profile
            console.log('Updating temperature profile:', profile.id, profile);
            return await api.patch(`/temperature-profiles/${profile.id}`, {
              temperature: profile.temperature,
              timeA: profile.timeA,
              timeB: profile.timeB,
              timeC: profile.timeC,
            });
          } else {
            // Create new profile
            console.log('Creating new temperature profile for order:', orderId, profile);

            // Get modeId from existing profiles or use a fallback
            const modeId = existingProfiles.length > 0 ? existingProfiles[0].modeId : 'default'; // This should be replaced with actual modeId lookup

            return await api.post('/temperature-profiles', {
              orderId,
              modeId,
              temperature: profile.temperature,
              timeA: profile.timeA,
              timeB: profile.timeB,
              timeC: profile.timeC,
            });
          }
        });

        // Execute all operations
        await Promise.all(deletePromises);
        const upsertResults = await Promise.all(upsertPromises);

        return upsertResults.map((r) => r.data);
      } catch (error) {
        console.error('Error updating temperature profiles:', error);
        throw transformAxiosError(error);
      }
    },
    onSuccess: (_, { orderId }) => {
      // Invalidate temperature profiles for this order
      queryClient.invalidateQueries({
        queryKey: ['temperature-profiles', 'by-order', orderId],
      });
      // Also invalidate the order readable data since it includes temperature profiles
      queryClient.invalidateQueries({ queryKey: ORDERS_READABLE_QUERY_KEYS.detail(orderId) });
    },
  });
};
