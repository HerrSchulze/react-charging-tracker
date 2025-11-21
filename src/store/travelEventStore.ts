import { create } from 'zustand';
import { TravelEvent, TravelEventUiState } from '../types';
import { TravelEventRepository } from '../services/TravelEventRepository';
import { PAGINATION } from '../constants';
import { PerformanceMonitor } from '../utils/performance';

interface TravelEventStore extends TravelEventUiState {
  loadTravelEvents: (page?: number) => Promise<void>;
  insertTravelEvent: (event: Omit<TravelEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTravelEvent: (event: TravelEvent) => Promise<void>;
  deleteTravelEvent: (id: string) => Promise<void>;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
}

const repository = new TravelEventRepository();

export const useTravelEventStore = create<TravelEventStore>((set) => ({
  travelEvents: [],
  loading: false,
  error: null,
  currentPage: 0,

  loadTravelEvents: async (page = 0) => {
    set({ loading: true, error: null });
    try {
      const events = await PerformanceMonitor.measureAsync(
        'loadTravelEvents',
        () => repository.getAllPaginated(page, PAGINATION.itemsPerPage)
      );
      set({ travelEvents: events, currentPage: page, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  insertTravelEvent: async (event) => {
    set({ loading: true, error: null });
    try {
      await PerformanceMonitor.measureAsync('insertTravelEvent', () => repository.insert(event));
      const events = await repository.getAllPaginated(0, PAGINATION.itemsPerPage);
      set({ travelEvents: events, currentPage: 0, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateTravelEvent: async (event) => {
    set({ loading: true, error: null });
    try {
      await PerformanceMonitor.measureAsync('updateTravelEvent', () => repository.update(event));
      const events = await repository.getAllPaginated(0, PAGINATION.itemsPerPage);
      set({ travelEvents: events, currentPage: 0, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteTravelEvent: async (id) => {
    set({ loading: true, error: null });
    try {
      await PerformanceMonitor.measureAsync('deleteTravelEvent', () => repository.delete(id));
      const events = await repository.getAllPaginated(0, PAGINATION.itemsPerPage);
      set({ travelEvents: events, currentPage: 0, loading: false });
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
