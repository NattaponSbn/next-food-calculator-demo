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

export const MODAL_CLOSED_GRACEFULLY = Symbol("MODAL_CLOSED_GRACEFULLY");

export const useModalStore = create<ModalState>((set, get) => ({
  isOpen: false, content: null, resolve: null, reject: null,
  open: <T>(content: React.ReactNode) => new Promise<T>((resolve, reject) => set({ isOpen: true, content, resolve, reject })),
  close: (value) => {
    const { resolve, reject } = get();
   if (value === MODAL_CLOSED_GRACEFULLY) {
        // ถ้าเป็นการปิดแบบปกติ (เช่น โหมด view) ให้ resolve ด้วยค่า null
        // เพื่อให้ Promise จบลงอย่างสวยงามโดยไม่เข้า catch
        if (resolve) resolve(null as any); 
    } else if (value !== undefined && resolve) {
        // ถ้ามีการส่งค่ากลับมา ให้ resolve ด้วยค่านั้นๆ
        resolve(value);
    } else if (reject) {
        // ถ้าเป็นการยกเลิก (เช่น กดปุ่ม Cancel ในโหมด Edit) ให้ reject
        reject(new Error('Modal was closed by the user.'));
    }
    set({ isOpen: false, content: null, resolve: null, reject: null });
  },
}));