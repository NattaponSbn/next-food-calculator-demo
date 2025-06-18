// store/uiStore.ts
import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  showLoading: () => set({ isLoading: true }),
  hideLoading: () => set({ isLoading: false }),
}));