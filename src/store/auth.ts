import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, UserRole } from '@/types';
import { authApi } from '@/lib/api/auth';
import { toast } from 'react-hot-toast';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  addAdmin: (email: string, password: string, role: UserRole) => Promise<void>;
  removeAdmin: (adminId: string) => Promise<void>;
  getAdmins: () => Promise<User[]>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        set({ isLoading: true });
        try {
          const user = await authApi.getCurrentUser();
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
      logout: async () => {
        try {
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false });
          toast.success('Logged out successfully');
        } catch (error) {
          console.error('Logout error:', error);
          toast.error('Failed to logout');
        }
      },
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { token, user } = await authApi.login(email, password);
          localStorage.setItem('token', token);
          set({ user, isAuthenticated: true });
          toast.success('Login successful');
        } catch (error) {
          toast.error('Login failed');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      register: async (email: string, password: string, name: string, role?: UserRole) => {
        set({ isLoading: true });
        try {
          const { token, user } = await authApi.register(email, password, name, role);
          localStorage.setItem('token', token);
          set({ user, isAuthenticated: true });
          toast.success('Registration successful');
        } catch (error) {
          toast.error('Registration failed');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      addAdmin: async (email: string, password: string, role: UserRole) => {
        const currentUser = get().user;
        if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
          throw new Error('Only super admins can add new admins');
        }

        set({ isLoading: true });
        try {
          const { token, user } = await authApi.addAdmin(email, password, role);
          localStorage.setItem('token', token);
          set({ user, isAuthenticated: true });
          toast.success('Admin added successfully');
        } catch (error) {
          toast.error('Failed to add admin');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      removeAdmin: async (adminId: string) => {
        const currentUser = get().user;
        if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
          throw new Error('Only super admins can remove admins');
        }

        set({ isLoading: true });
        try {
          await authApi.removeAdmin(adminId);
          toast.success('Admin removed successfully');
        } catch (error) {
          toast.error('Failed to remove admin');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      getAdmins: async () => {
        try {
          return await authApi.getAdmins();
        } catch (error) {
          console.error('Get admins error:', error);
          return [];
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
); 