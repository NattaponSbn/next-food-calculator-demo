// components/TablePagination.tsx

import React from 'react';
import { Pagination as FlowbitePagination } from 'flowbite-react';
import type { Table } from '@tanstack/react-table';

// สร้าง Interface สำหรับ Props
interface TablePaginationProps<T> {
  table: Table<T>;
}

export const TablePagination = <T,>({ table }: TablePaginationProps<T>) => {
  // ดึงค่า state ปัจจุบันจาก table instance
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  
  // สร้างฟังก์ชัน Handler สำหรับการเปลี่ยนหน้า
  const onPageChange = (page: number) => {
    // Flowbite-React ส่ง page number (เริ่มจาก 1) มาให้
    // แต่ react-table ใช้ page index (เริ่มจาก 0)
    // ดังนั้นเราต้องลบออก 1
    table.setPageIndex(page - 1); 
  };
  
  // ไม่ต้องแสดงผลถ้ามีแค่หน้าเดียวหรือไม่มีข้อมูล
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center text-center py-4">
      <FlowbitePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        showIcons // แสดงไอคอน < >
        // (Optional) สามารถเพิ่ม props อื่นๆ ของ Flowbite ได้
        // layout="table" 
        // previousLabel="Go back"
        // nextLabel="Go forward"
      />
    </div>
  );
};