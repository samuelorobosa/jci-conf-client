export type UserRole = 'SUPER_ADMIN' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type OrganizationType = 'CITY' | 'COLLEGIATE';

export interface Delegate {
  id: string;
  fullName: string;
  localOrganization: string;
  organizationType: OrganizationType;
  email: string;
  phoneNumber: string;
  trainings: Training[];
  banquetSeat?: {
    tableNumber: number;
    seatNumber: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DelegateFormData {
  fullName: string;
  localOrganization: string;
  organizationType: OrganizationType;
  email: string;
  phoneNumber: string;
}

export interface Training {
  id: string;
  name: string;
  trainer: string;
  location: string;
  time: string;
  date: string;
}

export interface BanquetTable {
  id: string;
  tableNumber: number;
  maxCapacity: number;
  currentOccupancy: number;
  isDignitaryTable: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 