import { Training } from '@/types';
import { api } from './api';

export const trainingsApi = {
  // Get all trainings
  getTrainings: async (): Promise<Training[]> => {
    const response = await api.get('/trainings');
    return response.data;
  },

  // Get training by ID
  getTrainingById: async (id: string): Promise<Training> => {
    const response = await api.get(`/trainings/${id}`);
    return response.data;
  },

  // Create new training
  createTraining: async (data: Omit<Training, 'id'>): Promise<Training> => {
    const response = await api.post('/trainings', data);
    return response.data;
  },

  // Update training
  updateTraining: async (id: string, data: Omit<Training, 'id'>): Promise<Training> => {
    const response = await api.put(`/trainings/${id}`, data);
    return response.data;
  },

  // Delete training
  deleteTraining: async (id: string): Promise<void> => {
    await api.delete(`/trainings/${id}`);
  },

  // Get trainings for a delegate
  getDelegateTrainings: async (delegateId: string): Promise<Training[]> => {
    const response = await api.get(`/delegates/${delegateId}/trainings`);
    return response.data;
  },
}; 