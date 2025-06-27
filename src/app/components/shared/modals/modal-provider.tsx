// components/modals/ModalProvider.tsx
'use client';

import { useModalStore } from "@/app/core/store/use-modal-store";

export function ModalProvider() {
  const { isOpen, content, close } = useModalStore();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto pt-10" onClick={() => close()}>
      <div onClick={(e) => e.stopPropagation()}>{content}</div>
    </div>
  );
}