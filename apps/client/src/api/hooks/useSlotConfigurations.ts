import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  BulkUpdateSlotConfigRequest,
  CreateSlotConfigRequest,
  SlotConfigResponse,
  SlotConfigsResponse,
  SlotConfiguration,
  UpdateSlotConfigRequest,
} from 'types/slot-config.types';

const API_BASE = '/api/slot-configurations';

// Fetch all slot configurations
export const useSlotConfigurations = () => {
  return useQuery<SlotConfigsResponse>({
    queryKey: ['slot-configurations'],
    queryFn: async () => {
      const response = await fetch(API_BASE);
      if (!response.ok) {
        throw new Error('Failed to fetch slot configurations');
      }
      return response.json();
    },
  });
};

// Fetch single slot configuration
export const useSlotConfiguration = (slotNumber: number) => {
  return useQuery<SlotConfigResponse>({
    queryKey: ['slot-configuration', slotNumber],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/${slotNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch slot configuration');
      }
      return response.json();
    },
    enabled: slotNumber >= 0,
  });
};

// Create slot configuration
export const useCreateSlotConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation<SlotConfigResponse, Error, CreateSlotConfigRequest>({
    mutationFn: async (data) => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create slot configuration');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slot-configurations'] });
    },
  });
};

// Update slot configuration
export const useUpdateSlotConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation<SlotConfigResponse, Error, { slotNumber: number; data: UpdateSlotConfigRequest }>({
    mutationFn: async ({ slotNumber, data }) => {
      const response = await fetch(`${API_BASE}/${slotNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update slot configuration');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slot-configurations'] });
    },
  });
};

// Delete slot configuration
export const useDeleteSlotConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation<SlotConfigResponse, Error, number>({
    mutationFn: async (slotNumber) => {
      const response = await fetch(`${API_BASE}/${slotNumber}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete slot configuration');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slot-configurations'] });
    },
  });
};

// Bulk update slot configurations
export const useBulkUpdateSlotConfigurations = () => {
  const queryClient = useQueryClient();

  return useMutation<SlotConfigsResponse, Error, BulkUpdateSlotConfigRequest>({
    mutationFn: async (data) => {
      const response = await fetch(`${API_BASE}/bulk-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to bulk update slot configurations');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slot-configurations'] });
    },
  });
};

// Reset to default configuration
export const useResetSlotConfigurations = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error>({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE}/reset`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to reset slot configurations');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slot-configurations'] });
    },
  });
};
