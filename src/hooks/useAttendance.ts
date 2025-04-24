import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface Attendance {
  id: string;
  userId: string;
  trainingId: string;
  checkedIn: boolean;
  checkInAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'DELEGATE';
  };
  training: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string | null;
  };
}

interface TrainingStats {
  totalAttendees: number;
  checkedInAttendees: number;
  checkInRate: number;
}

export const useTrainingAttendance = (trainingId: string) => {
  return useQuery({
    queryKey: ['attendance', 'training', trainingId],
    queryFn: async () => {
      const { data } = await api.get<Attendance[]>(`/attendance/training/${trainingId}`);
      return data;
    },
  });
};

export const useUserAttendance = (userId: string) => {
  return useQuery({
    queryKey: ['attendance', 'user', userId],
    queryFn: async () => {
      const { data } = await api.get<Attendance[]>(`/attendance/user/${userId}`);
      return data;
    },
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trainingId: string) => {
      const { data } = await api.post<Attendance>(`/attendance/check-in/${trainingId}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'training', data.trainingId] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'user', data.userId] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'stats', data.trainingId] });
      toast.success('Check-in successful');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to check in');
    },
  });
};

export const useTrainingStats = (trainingId: string) => {
  return useQuery({
    queryKey: ['attendance', 'stats', trainingId],
    queryFn: async () => {
      const { data } = await api.get<TrainingStats>(`/attendance/stats/${trainingId}`);
      return data;
    },
  });
}; 