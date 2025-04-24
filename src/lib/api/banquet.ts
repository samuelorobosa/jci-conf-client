import { api } from './api';
import { BanquetTable } from '@/types';

export const banquetApi = {
  getTables: async (): Promise<BanquetTable[]> => {
    const response = await api.get('/banquet/tables');
    return response.data;
  },
}; 