import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface Delegate {
  id: string;
  fullName: string;
  localOrganization: string;
  organizationType: 'CITY' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL';
  email: string;
  phoneNumber: string;
  tableNumber?: number;
  seatNumber?: number;
  createdAt: string;
  updatedAt: string;
  trainings: Array<{
    id: string;
    title: string;
    startDate: string;
    endDate: string;
  }>;
}

interface CreateDelegateData {
  fullName: string;
  localOrganization: string;
  organizationType: 'CITY' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL';
  email: string;
  phoneNumber: string;
}

interface UpdateDelegateData {
  fullName?: string;
  localOrganization?: string;
  organizationType?: 'CITY' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL';
  email?: string;
  phoneNumber?: string;
}

export const useDelegates = () => {
  return useQuery({
    queryKey: ['delegates'],
    queryFn: async () => {
      const { data } = await api.get<Delegate[]>('/delegates');
      return data;
    },
  });
};

export const useDelegate = (id: string) => {
  return useQuery({
    queryKey: ['delegates', id],
    queryFn: async () => {
      const { data } = await api.get<Delegate>(`/delegates/${id}`);
      return data;
    },
  });
};

export const useCreateDelegate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (delegateData: CreateDelegateData) => {
      const { data } = await api.post<Delegate>('/delegates', delegateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delegates'] });
      toast.success('Delegate created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create delegate');
    },
  });
};

export const useUpdateDelegate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, delegateData }: { id: string; delegateData: UpdateDelegateData }) => {
      const { data } = await api.put<Delegate>(`/delegates/${id}`, delegateData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['delegates'] });
      queryClient.invalidateQueries({ queryKey: ['delegates', data.id] });
      toast.success('Delegate updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update delegate');
    },
  });
};

export const useDeleteDelegate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/delegates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delegates'] });
      toast.success('Delegate deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete delegate');
    },
  });
};

export const useAssignTrainings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ delegateId, trainingIds }: { delegateId: string; trainingIds: string[] }) => {
      const { data } = await api.post<Delegate>(`/delegates/${delegateId}/trainings`, { trainingIds });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['delegates'] });
      queryClient.invalidateQueries({ queryKey: ['delegates', data.id] });
      toast.success('Trainings assigned successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign trainings');
    },
  });
};

export const useAssignBanquetSeating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ delegateId, tableNumber, seatNumber }: { delegateId: string; tableNumber: number; seatNumber: number }) => {
      const { data } = await api.post<Delegate>(`/delegates/${delegateId}/banquet-seating`, { tableNumber, seatNumber });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['delegates'] });
      queryClient.invalidateQueries({ queryKey: ['delegates', data.id] });
      toast.success('Banquet seating assigned successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign banquet seating');
    },
  });
}; 