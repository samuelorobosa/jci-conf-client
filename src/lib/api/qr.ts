import { Delegate } from '@/types';
import { api } from './api';

export interface Event {
  id: string;
  name: string;
  date: string;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
}

export const qrApi = {
  // Verify delegate QR code
  verifyDelegate: async (delegateId: string): Promise<Delegate> => {
    const response = await api.get(`/qr/verify/${delegateId}`);
    return response.data;
  },

  // Record attendance
  recordAttendance: async (delegateId: string, eventId: string): Promise<void> => {
    await api.post('/qr/attendance', { delegateId, eventId });
  },

  // Get delegate attendance history
  getDelegateAttendance: async (delegateId: string): Promise<{
    eventId: string;
    timestamp: string;
  }[]> => {
    const response = await api.get(`/qr/attendance/${delegateId}`);
    return response.data;
  },

  // Get event details
  getEvent: async (eventId: string): Promise<Event> => {
    const response = await api.get(`/qr/events/${eventId}`);
    return response.data;
  },
}; 