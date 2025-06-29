// components/shared/SortableHeader.tsx
import React from 'react';
import { Column } from '@tanstack/react-table';
import { Icon } from '@iconify/react';

// Props ที่ Component นี้จะรับ
interface SortableHeaderProps {
  column: Column<any, unknown>;
  children: React.ReactNode; // ใช้ children เพื่อรับ Title ที่เป็น JSX หรือ string
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({ column, children }) => {
  // ดึงสถานะการ sort ปัจจุบัน
  const sorted = column.getIsSorted();

  // สร้างฟังก์ชันสำหรับสลับการ sort
  // `column.toggleSorting` รับ boolean เพื่อบอกว่าจะ force ให้ sort desc หรือไม่ (true = desc)
  // เราจะสลับจาก 'asc' ไป 'desc'
  const handleSort = () => {
     column.toggleSorting(); 
  };

  return (
    <button
      className="flex items-center justify-center gap-1 font-semibold"
      onClick={handleSort}
        title={
            sorted === 'asc'
            ? 'Sorted ascending. Click to sort descending.'
            : sorted === 'desc'
            ? 'Sorted descending. Click to remove sort.'
            : 'Not sorted. Click to sort ascending.'
        }
        >
      {/* 1. แสดง Title ที่ส่งเข้ามาผ่าน children */}
      <span>{children}</span>

      {/* 2. แสดงไอคอนตามสถานะการ sort */}
      {sorted === 'desc' ? (
        <Icon icon="akar-icons:arrow-down" className="h-4 w-4" />
      ) : sorted === 'asc' ? (
        <Icon icon="akar-icons:arrow-up" className="h-4 w-4" />
      ) : (
        // ถ้ายังไม่ได้ sort แสดงไอคอนทั้งขึ้นและลงแบบจางๆ
        <Icon icon="bi:arrow-down-up" className="h-3 w-3 text-gray-400" />
      )}
    </button>
  );
};