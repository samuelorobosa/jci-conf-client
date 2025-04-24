import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface Training {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  attendances: Array<{
    id: string;
    checkedIn: boolean;
    checkInAt: string | null;
    user: {
      id: string;
      name: string;
      email: string;
      role: 'ADMIN' | 'DELEGATE';
    };
  }>;
}

interface CreateTrainingData {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
}

interface UpdateTrainingData {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

export const useTrainings = () => {
  return useQuery({
    queryKey: ['trainings'],
    queryFn: async () => {
      const { data } = await api.get<Training[]>('/trainings');
      return data;
    },
  });
};

export const useTraining = (id: string) => {
  return useQuery({
    queryKey: ['trainings', id],
    queryFn: async () => {
      const { data } = await api.get<Training>(`/trainings/${id}`);
      return data;
    },
  });
};

export const useCreateTraining = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trainingData: CreateTrainingData) => {
      const { data } = await api.post<Training>('/trainings', trainingData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      toast.success('Training created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create training');
    },
  });
};

export const useUpdateTraining = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, trainingData }: { id: string; trainingData: UpdateTrainingData }) => {
      const { data } = await api.put<Training>(`/trainings/${id}`, trainingData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      queryClient.invalidateQueries({ queryKey: ['trainings', data.id] });
      toast.success('Training updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update training');
    },
  });
};

export const useDeleteTraining = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/trainings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      toast.success('Training deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete training');
    },
  });
}; 