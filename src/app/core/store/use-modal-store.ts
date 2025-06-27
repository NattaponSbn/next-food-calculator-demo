// stores/useModalStore.ts
import { create } from 'zustand';
import React from 'react';

interface ModalState {
  isOpen: boolean;
  content: React.ReactNode | null;
  resolve: ((value: any) => void) | null;
  reject: ((reason?: any) => void) | null;
  open: <T>(content: React.ReactNode) => Promise<T>;
  close: (value?: any) => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  isOpen: false, content: null, resolve: null, reject: null,
  open: <T>(content: React.ReactNode) => new Promise<T>((resolve, reject) => set({ isOpen: true, content, resolve, reject })),
  close: (value) => {
    const { resolve, reject } = get();
    if (value !== undefined && resolve) resolve(value);
    else if (reject) reject(new Error('Modal was closed by the user.'));
    set({ isOpen: false, content: null, resolve: null, reject: null });
  },
}));