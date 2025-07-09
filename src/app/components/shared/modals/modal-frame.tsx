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
// function getModalSizeClass(size: ModalSize = 'md'): string {
//   // ตรวจสอบว่า size ที่ส่งมาเป็นหนึ่งในขนาดมาตรฐานหรือไม่
//   if (standardSizes.includes(size as StandardModalSize)) {
//     // ถ้าใช่, ให้ดึงค่าจาก mapping object
//     return sizeClasses[size as StandardModalSize];
//   }
//   // ถ้าไม่ใช่, ให้ถือว่าค่าที่ส่งมาคือ CSS class โดยตรง
//   return size;
// }

export const getModalSizeClass = (size: ModalSize): string => {
  // 1. ตรวจสอบว่า `size` เป็น string ที่มี custom class หรือไม่
  if (typeof size === 'string' && size.includes(' ')) {
    return size; // คืนค่า string นั้นไปตรงๆ เลย
  }

  // 2. ถ้าไม่ใช่ ให้ใช้ switch-case แบบเดิม
  switch (size) {
    case 'sm': return 'w-full max-w-sm';
    case 'md': return 'w-full max-w-md';
    case 'lg': return 'w-full max-w-lg';
    case 'xl': return 'w-full max-w-xl';
    case '2xl': return 'w-full max-w-2xl';
    case '3xl': return 'w-full max-w-3xl';
    case '4xl': return 'w-full max-w-4xl';
    case '5xl': return 'w-full max-w-5xl';
    default: return 'w-full max-w-md';
  }
};

export function ModalFrame({ title, children, footer, size = 'md' }: ModalFrameProps) {
  const modalSizeClass = getModalSizeClass(size);
  return (
    <div className={`relative mx-auto my-auto ${modalSizeClass} overflow-y-auto bg-white rounded-lg shadow-xl flex flex-col`} >
      <header className="flex items-start justify-between rounded-t border-b p-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </header>
      <main className="space-y-4 p-6 flex-1">{children}</main>
      <footer className="flex items-center justify-end space-x-2 rounded-b border-t p-4">
        {footer}
      </footer>
    </div>
  );
}