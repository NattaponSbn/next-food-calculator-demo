// hooks/useServerSideTable.ts

// 1. Import 'useCallback' เพิ่มเข้ามา
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from '@tanstack/react-table';
import apiClient from '../services/api-client'; // สมมติว่า path นี้ถูกต้อง
import { ApiSearchRequest, FilterCriteria, PageResult, SortCriteria } from '../models/shared/page.model'; // สมมติว่า path นี้ถูกต้อง
import { useUIStore } from '../store/ui-store'; // สมมติว่า path นี้ถูกต้อง

// Interface ของ Props ไม่มีการเปลี่ยนแปลง
interface UseServerSideTableProps<T extends Record<string, any>> {
  columns: ColumnDef<T>[];
  apiUrl: string;
  initialPageSize?: number;
  initialCriteria?: Record<string, any>;
  useMock?: boolean;
  mockData?: T[];
}

export const useServerSideTable = <T extends Record<string, any>>({
  columns,
  apiUrl,
  initialPageSize = 30,
  initialCriteria = {}, // 2. กำหนดค่าเริ่มต้นเป็น object ว่างเพื่อความปลอดภัย
  useMock = false,
  mockData = [],
}: UseServerSideTableProps<T>) => {
  // States ทั้งหมดยังคงเหมือนเดิม
  const [data, setData] = useState<T[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    // แปลง initialCriteria เป็นรูปแบบของ TanStack Table Filters
    () => Object.entries(initialCriteria).map(([id, value]) => ({ id, value }))
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // 3. [ย้ายออกมา] สร้าง fetchData นอก useEffect และห่อด้วย useCallback
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    useUIStore.getState().showLoading();

    // --- Logic การสร้าง Request Body ---
    // แปลง columnFilters กลับไปเป็น object ธรรมดา
    const apiCriteriaObject: FilterCriteria = columnFilters.reduce((acc, filter) => {
      acc[filter.id] = filter.value;
      return acc;
    }, {} as FilterCriteria);
    
    const requestBody: ApiSearchRequest = {
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      // รวม initialCriteria และ filter ปัจจุบันเข้าด้วยกัน
      // โดยให้ filter ปัจจุบันมี priority สูงกว่า
      criteria: { ...initialCriteria, ...apiCriteriaObject }
    };

    const sortCriteria = sorting[0];
    if (sortCriteria) {
      requestBody.sort = {
        column: sortCriteria.id,
        direction: sortCriteria.desc ? 'desc' : 'asc',
      };
    }

    // --- Logic การดึงข้อมูล (จริง หรือ จำลอง) ---
    if (useMock) {
      // ===== โหมดจำลองการทำงาน (Mock Mode) =====
      console.log("RUNNING IN MOCK MODE with request:", requestBody);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

      // (ส่วนนี้คุณต้อง implement logic การ filter/sort mockData เองตาม requestBody)
      const totalItems = mockData.length;
      const totalPages = Math.ceil(totalItems / pagination.pageSize);
      const startIndex = pagination.pageIndex * pagination.pageSize;
      const pageItems = mockData.slice(startIndex, startIndex + pagination.pageSize);

      setData(pageItems);
      setPageCount(totalPages);

    } else {
      // ===== โหมด API จริง =====
      try {
        console.log("FETCHING FROM API with request:", requestBody);
        const result = await apiClient.post<PageResult<T>>(apiUrl, requestBody);
        setData(result.data.items || []);
        setPageCount(result.data.pageCount || 0);
      } catch (error) {
        console.error("Error fetching table data:", error);
        setData([]);
        setPageCount(0);
      }
    }

    // ทำงานส่วนนี้เสมอ ไม่ว่าจะสำเร็จหรือล้มเหลว
    setIsLoading(false);
    useUIStore.getState().hideLoading();

  }, [
    // 4. [สำคัญ] ใส่ Dependencies ทั้งหมดที่ fetchData ใช้
    apiUrl,
    pagination.pageIndex,
    pagination.pageSize,
    JSON.stringify(sorting), // 5. Stringify object/array ที่ซับซ้อน
    JSON.stringify(columnFilters),
    initialCriteria,
    useMock,
    mockData,
  ]);


  // 6. [แก้ไข] useEffect จะเหลือแค่การเรียก fetchData เท่านั้น
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency คือตัวฟังก์ชัน fetchData ที่ถูก memoized ด้วย useCallback


  // การสร้าง table instance ไม่มีการเปลี่ยนแปลง
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  // 7. [ทำงานได้แล้ว!] คืนค่า refetch ซึ่งก็คือ fetchData ที่เราสร้างไว้
  return {
    table,
    isLoading,
    refetch: fetchData,
  };
};