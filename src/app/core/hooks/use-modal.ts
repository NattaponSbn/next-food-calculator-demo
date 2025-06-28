// hooks/useModal.ts

import React from 'react';
import { useModalStore } from '../store/use-modal-store';

/**
 * Props ที่จะถูก "ฉีด" (inject) เข้าไปใน Modal Component
 */
export type InjectedModalProps<TResult = any> = {
  onConfirm: (result: TResult) => void;
   onClose: (options?: { isCancellation: boolean }) => void;
};

/**
 * Custom Hook สำหรับสร้างฟังก์ชันเปิด Modal ที่เป็น Type-safe
 * @template TModalProps - Type ของ Props ที่ Modal Component ต้องการ (เช่น { mode: 'create' })
 * @template TModalResult - Type ของข้อมูลที่ Modal จะส่งกลับมา
 * @param Component - React Component ของ Modal ที่จะเปิด
 *                  ต้องรับ Props ของตัวเอง และ InjectedModalProps
 */
export function useModal<TModalProps extends object, TModalResult = any>(
  component: React.ComponentType<TModalProps & InjectedModalProps<TModalResult>>
) {
  const { open, close } = useModalStore();

  const show = (props: TModalProps): Promise<TModalResult> => {
   const elementProps = {
    ...props,
    onConfirm: (result: TModalResult) => close(result),
    onClose: ({ isCancellation = true } = {}) => {
      close(isCancellation ? undefined : 'MODAL_CLOSED_GRACEFULLY');
    },
  };
  
  // ส่ง Component และ Props Object ที่สร้างไว้เข้าไป
  return open<TModalResult>(
    React.createElement(component, elementProps)
  );
  };

  return show;
}