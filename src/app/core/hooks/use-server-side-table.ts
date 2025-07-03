// src/app/core/hooks/use-server-side-table.ts

import { useState, useEffect, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from '@tanstack/react-table';
import type { ApiSearchRequest, FilterCriteria, PageResult } from '../models/shared/page.model';

/**
 * Props สำหรับ useServerSideTable Hook
 */
interface UseServerSideTableProps<T extends Record<string, any>> {
  /**
   * ฟังก์ชันสำหรับดึงข้อมูล (จริงหรือจำลอง) ที่จะถูกเรียกเมื่อ state เปลี่ยน
   */
  fetchDataFn: (request: ApiSearchRequest) => Promise<PageResult<T>>;
  /**
   * นิยามคอลัมน์ของตาราง
   */
  columns: ColumnDef<T>[];
  /**
   * จำนวนรายการต่อหน้าที่ต้องการแสดงเป็นค่าเริ่มต้น
   */
  initialPageSize?: number;
  /**
   * เงื่อนไขการกรองเริ่มต้น
   */
  initialCriteria?: Record<string, any>;
}

/**
 * Custom Hook สำหรับจัดการ State และ Logic ของตารางข้อมูลแบบ Server-side
 */
export const useServerSideTable = <T extends Record<string, any>>({
  fetchDataFn,
  columns,
  initialPageSize = 10,
  initialCriteria = {},
}: UseServerSideTableProps<T>) => {
  // --- States สำหรับจัดการตาราง ---
  const [data, setData] = useState<T[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // ใช้สำหรับ Loading เฉพาะจุด
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    () => Object.entries(initialCriteria).map(([id, value]) => ({ id, value }))
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // --- ฟังก์ชันหลักสำหรับดึงข้อมูล ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    // 1. สร้าง Request Body จาก State ปัจจุบัน
    const apiCriteriaObject: FilterCriteria = columnFilters.reduce((acc, filter) => {
      if (filter.value !== null && filter.value !== undefined && filter.value !== '') {
        acc[filter.id] = filter.value;
      }
      return acc;
    }, {} as FilterCriteria);
    
    const requestBody: ApiSearchRequest = {
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      criteria: { ...initialCriteria, ...apiCriteriaObject }
    };

    if (sorting.length > 0) {
      requestBody.sort = {
        column: sorting[0].id,
        direction: sorting[0].desc ? 'desc' : 'asc',
      };
    }

    // 2. เรียกใช้ fetchDataFn ที่ได้รับมา
    try {
      console.log("Fetching data with request:", requestBody);
      const result = await fetchDataFn(requestBody);
      console.log(result,'resultresultresult');
      
      setData(result.items || []);
      setPageCount(result.pageCount || 0);
    } catch (error) {
      console.error("Error in useServerSideTable fetchData:", error);
      // Reset state เมื่อเกิด error เพื่อป้องกันข้อมูลค้าง
      setData([]);
      setPageCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    // 3. ใส่ Dependencies ทั้งหมดที่ fetchData ใช้
    fetchDataFn, 
    pagination.pageIndex, 
    pagination.pageSize, 
    sorting, 
    columnFilters, 
    initialCriteria
  ]);

  // 3. useEffect ที่จะ re-fetch ข้อมูลเมื่อเงื่อนไขเปลี่ยน
  useEffect(() => {
    // ไม่ต้องเรียก fetchData() ที่นี่โดยตรง
    // Component แม่จะเป็นคนเรียก refetch() ครั้งแรกเอง
    // แต่ Hook นี้จะ re-fetch อัตโนมัติเมื่อผู้ใช้เปลี่ยนหน้า, sort, หรือ filter
  }, [
    fetchData // ต้องใส่ไว้เพื่อให้ Hook ทำงานใหม่ถ้าฟังก์ชันที่ส่งมาเปลี่ยน
  ]);

  // --- สร้าง Table Instance ---
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { sorting, columnFilters, pagination },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  // --- คืนค่าทั้งหมดที่จำเป็น ---
  return {
    table,
    isLoading,
    refetch: fetchData,
  };
};