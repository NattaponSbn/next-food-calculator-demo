// store/uiStore.ts
import { create } from 'zustand';
let requestCount = 0;
interface UIState {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
 showLoading: () => {
    requestCount++;
    set({ isLoading: true });
  },
  hideLoading: () => {
    requestCount--;
    if (requestCount <= 0) {
      requestCount = 0; // ป้องกันค่าติดลบ
      set({ isLoading: false });
    }
  },
}));