import { Delegate, DelegateFormData } from '@/types';
import { api } from './api';

interface GetDelegatesParams {
  page?: number;
  limit?: number;
  search?: string;
  localOrganization?: string;
}

interface GetDelegatesResponse {
  data: Delegate[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const delegatesApi = {
  // Get all delegates
  getDelegates: async (params?: GetDelegatesParams): Promise<GetDelegatesResponse> => {
    const response = await api.get('/delegates', { params });
    return response.data;
  },

  // Get delegate by ID
  getDelegateById: async (id: string): Promise<Delegate> => {
    const response = await api.get(`/delegates/${id}`);
    return response.data;
  },

  // Get delegate from QR code
  getDelegateFromQR: async (delegateId: string): Promise<Delegate> => {
    const response = await api.get(`/delegates/qr/${delegateId}`);
    return response.data;
  },

  // Create new delegate
  createDelegate: async (data: DelegateFormData): Promise<Delegate> => {
    const response = await api.post('/delegates', data);
    return response.data;
  },

  // Update delegate
  updateDelegate: async (id: string, data: DelegateFormData): Promise<Delegate> => {
    const response = await api.put(`/delegates/${id}`, data);
    return response.data;
  },

  // Delete delegate
  deleteDelegate: async (id: string): Promise<void> => {
    await api.delete(`/delegates/${id}`);
  },

  // Assign trainings to delegate
  assignTrainings: async (delegateId: string, trainingIds: string[]): Promise<Delegate> => {
    const response = await api.post(`/delegates/${delegateId}/trainings`, { trainingIds });
    return response.data;
  },

  // Assign banquet seating
  assignBanquetSeating: async (
    delegateId: string,
    tableNumber: number,
    seatNumber: number
  ): Promise<Delegate> => {
    const response = await api.post(`/delegates/${delegateId}/banquet-seating`, {
      tableNumber,
      seatNumber,
    });
    return response.data;
  },
}; 