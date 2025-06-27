// components/modals/ModalFrame.tsx
import React from 'react';

// 1. กำหนดขนาดมาตรฐาน
const standardSizes = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'] as const;
type StandardModalSize = typeof standardSizes[number];

// 2. สร้าง mapping สำหรับขนาดมาตรฐาน
const sizeClasses: Record<StandardModalSize, string> = {
  sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl',
  '2xl': 'max-w-2xl', '3xl': 'max-w-3xl', '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl', '6xl': 'max-w-6xl', '7xl': 'max-w-7xl',
};

// 3. [สำคัญ] กำหนด Type ของ 'size' prop ให้ยืดหยุ่น
// สามารถเป็นขนาดมาตรฐาน หรือ string อะไรก็ได้ (สำหรับ custom class)
export type ModalSize = StandardModalSize | string;

interface ModalFrameProps {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  size?: ModalSize;
}

// 4. ฟังก์ชัน helper สำหรับหา CSS class ที่ถูกต้อง
function getModalSizeClass(size: ModalSize = 'md'): string {
  // ตรวจสอบว่า size ที่ส่งมาเป็นหนึ่งในขนาดมาตรฐานหรือไม่
  if (standardSizes.includes(size as StandardModalSize)) {
    // ถ้าใช่, ให้ดึงค่าจาก mapping object
    return sizeClasses[size as StandardModalSize];
  }
  // ถ้าไม่ใช่, ให้ถือว่าค่าที่ส่งมาคือ CSS class โดยตรง
  return size;
}

export function ModalFrame({ title, children, footer, size = 'md' }: ModalFrameProps) {
  const modalSizeClass = getModalSizeClass(size);
  return (
    <div className={`relative w-full ${modalSizeClass} rounded-lg bg-white shadow-xl`}>
      <header className="flex items-start justify-between rounded-t border-b p-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </header>
      <main className="space-y-4 p-6">{children}</main>
      <footer className="flex items-center justify-end space-x-2 rounded-b border-t p-4">
        {footer}
      </footer>
    </div>
  );
}