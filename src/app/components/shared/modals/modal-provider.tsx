// components/modals/ModalProvider.tsx
'use client';

import { useModalStore } from "@/app/core/store/use-modal-store";

export function ModalProvider() {
  const { isOpen, content, close } = useModalStore();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-4" onClick={() => close()}>
      <div onClick={(e) => e.stopPropagation()} className="w-full">
        {content}
      </div>
    </div>
  );
}