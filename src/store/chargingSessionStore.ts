import { create } from 'zustand';
import { ChargingSession, ChargingSessionUiState } from '../types';
import { ChargingSessionRepository } from '../services/ChargingSessionRepository';
import { PAGINATION } from '../constants';
import { PerformanceMonitor } from '../utils/performance';

interface ChargingSessionStore extends ChargingSessionUiState {
  loadChargingSessions: (page?: number) => Promise<void>;
  insertChargingSession: (session: Omit<ChargingSession, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateChargingSession: (session: ChargingSession) => Promise<void>;
  deleteChargingSession: (id: string) => Promise<void>;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
}

const repository = new ChargingSessionRepository();

export const useChargingSessionStore = create<ChargingSessionStore>((set) => ({
  chargingSessions: [],
  loading: false,
  error: null,
  currentPage: 0,

  loadChargingSessions: async (page = 0) => {
    set({ loading: true, error: null });
    try {
      const sessions = await PerformanceMonitor.measureAsync(
        'loadChargingSessions',
        () => repository.getAllPaginated(page, PAGINATION.itemsPerPage)
      );
      set({ chargingSessions: sessions, currentPage: page, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  insertChargingSession: async (session) => {
    set({ loading: true, error: null });
    try {
      await PerformanceMonitor.measureAsync('insertChargingSession', () => repository.insert(session));
      const sessions = await repository.getAllPaginated(0, PAGINATION.itemsPerPage);
      set({ chargingSessions: sessions, currentPage: 0, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateChargingSession: async (session) => {
    set({ loading: true, error: null });
    try {
      await PerformanceMonitor.measureAsync('updateChargingSession', () => repository.update(session));
      const sessions = await repository.getAllPaginated(0, PAGINATION.itemsPerPage);
      set({ chargingSessions: sessions, currentPage: 0, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteChargingSession: async (id) => {
    set({ loading: true, error: null });
    try {
      await PerformanceMonitor.measureAsync('deleteChargingSession', () => repository.delete(id));
      const sessions = await repository.getAllPaginated(0, PAGINATION.itemsPerPage);
      set({ chargingSessions: sessions, currentPage: 0, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  clearError: () => {
    set({ error: null });
  },
}));
