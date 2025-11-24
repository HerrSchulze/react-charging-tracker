import { create } from 'zustand';

type Tab = 'travel-events' | 'charging-sessions' | 'export';
type Screen = 'list' | 'detail' | 'form';

interface NavigationState {
  activeTab: Tab;
  currentScreen: Screen;
  selectedId: string | null;
  filterTravelEventId: string | null;
  setActiveTab: (tab: Tab) => void;
  setCurrentScreen: (screen: Screen) => void;
  setSelectedId: (id: string | null) => void;
  setFilterTravelEventId: (id: string | null) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: 'charging-sessions',
  currentScreen: 'list',
  selectedId: null,
  filterTravelEventId: null,
  setActiveTab: (tab: Tab) => set({ activeTab: tab, currentScreen: 'list', selectedId: null }),
  setCurrentScreen: (screen: Screen) => set({ currentScreen: screen }),
  setSelectedId: (id: string | null) => set({ selectedId: id }),
  setFilterTravelEventId: (id: string | null) => set({ filterTravelEventId: id }),
}));
