import { api } from './api';
import { User, UserRole } from '@/types';

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  // Login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Add admin
  addAdmin: async (email: string, password: string, role: UserRole): Promise<LoginResponse> => {
    const response = await api.post('/auth/admins', { email, password, role });
    return response.data;
  },

  // Remove admin
  removeAdmin: async (adminId: string): Promise<void> => {
    await api.delete(`/auth/admins/${adminId}`);
  },

  // Get admins
  getAdmins: async (): Promise<User[]> => {
    const response = await api.get('/auth/admins');
    return response.data;
  },
}; 