import { create } from 'zustand';

export const useAppStore = create((set) => ({
  activeNav: 'home',
  setActiveNav: (nav) => set({ activeNav: nav }),
  
  selectedDestination: null,
  setSelectedDestination: (dest) => set({ selectedDestination: dest }),
  
  isGlobeLoaded: false,
  setGlobeLoaded: (loaded) => set({ isGlobeLoaded: loaded }),
}));

export default useAppStore;
