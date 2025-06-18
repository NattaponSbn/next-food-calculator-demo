// hooks/useServerSideTable.ts

import { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from '@tanstack/react-table';
import apiClient from '../services/api-client';
import { ApiSearchRequest, FilterCriteria, PageResult, SortCriteria } from '../models/shared/page.model';

// Interface ไม่มีการเปลี่ยนแปลง
interface UseServerSideTableProps<T extends Record<string, any>> {
  columns: ColumnDef<T>[];
  apiUrl: string;
  initialPageSize?: number;
  initialCriteria?: Record<string, any>; // <--- เพิ่ม prop นี้
  useMock?: boolean;    // <--- สวิตช์เปิด/ปิดโหมดจำลอง
  mockData?: T[];     // <--- ข้อมูลจำลอง
}

export const useServerSideTable = <T extends Record<string, any>>({
  columns,
  apiUrl,
  initialPageSize = 30,
  initialCriteria,
  useMock = false,   // <--- ค่าเริ่มต้นคือ false (โหมด API จริง)
  mockData = [],   // <--- ค่าเริ่มต้นคือ array ว่าง
}: UseServerSideTableProps<T>) => {
  // States ทั้งหมดไม่มีการเปลี่ยนแปลง
  const [data, setData] = useState<T[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // ยังคงเก็บ state นี้ไว้สำหรับ UI เฉพาะจุด
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    // ถ้าไม่มี initialCriteria ที่ส่งเข้ามา ให้ return array ว่าง
    if (!initialCriteria) {
      return [];
    }
    // ถ้ามี ให้แปลง object { key: value } 
    // เป็นรูปแบบที่ react-table เข้าใจ: [{ id: key, value: value }]
    return Object.entries(initialCriteria).map(([id, value]) => ({
      id,
      value,
    }));
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  useEffect(() => {
    if (useMock) {
      // ===== โหมดจำลองการทำงาน (Mock Mode) =====
      const simulateApi = async () => {
        setIsLoading(true);
        console.log("RUNNING IN MOCK MODE");

        // สร้าง requestBody เหมือนเดิม เพื่อใช้จำลองการกรอง/เรียงลำดับ
        const requestBody: ApiSearchRequest = {
          pageNumber: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          criteria: {}
        };

        // 1. จำลอง Network Delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // 2. จำลองการทำงานของ Backend (Filter, Sort, Paginate)
        let items = [...mockData]; // เริ่มต้นด้วยข้อมูล mock ทั้งหมด

        // (ตัวอย่าง) จำลองการกรอง
        const nameFilter = requestBody.criteria.providerNameEng;
        if (nameFilter) {
          items = items.filter(p =>
            p.providerNameEng?.toLowerCase().includes(nameFilter.toLowerCase())
          );
        }

        // (ตัวอย่าง) จำลองการเรียงลำดับ
        if (requestBody.sort) {
          const { column, direction } = requestBody.sort;
          items.sort((a, b) => {
            if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
            return 0;
          });
        }

        // 3. จำลองการแบ่งหน้า
        const totalItems = items.length;
        const pageCount = Math.ceil(totalItems / requestBody.pageSize);
        const startIndex = (requestBody.pageNumber - 1) * requestBody.pageSize;
        const pageItems = items.slice(startIndex, startIndex + requestBody.pageSize);

        // 4. สร้าง Response จำลอง
        const mockResult: PageResult<T> = {
          _kind: "mockPageResult",
          pageNumber: requestBody.pageNumber,
          pageSize: requestBody.pageSize,
          totalItemCount: totalItems,
          pageCount: pageCount,
          items: pageItems,
        };

        setData(mockResult.items);
        setPageCount(mockResult.pageCount);
        setIsLoading(false);
      };

      simulateApi();
    } else {
      const fetchData = async () => {
        setIsLoading(true);

        // การสร้าง Request Body ไม่มีการเปลี่ยนแปลง

        const apiCriteriaObject: FilterCriteria = columnFilters.reduce((acc, filter) => {
          acc[filter.id] = filter.value;
          return acc;
        }, {} as { [key: string]: any });

        const requestBody: ApiSearchRequest = {
          pageNumber: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          criteria: apiCriteriaObject
        };

        const sortCriteria = sorting[0];
        if (sortCriteria) {
          // 3. ถ้ามี ให้เพิ่ม property 'sort' เข้าไป
          requestBody.sort = {
            column: sortCriteria.id,
            direction: sortCriteria.desc ? 'desc' : 'asc',
          };
        }

        // --- [แก้ไข] เปลี่ยนมาใช้ apiClient ---
        try {
          // 2. ยิง API ด้วย apiClient.post
          // - ไม่ต้องกำหนด method, headers, หรือ stringify body เอง
          // - Interceptor จะคืนค่า response.data มาให้โดยอัตโนมัติ
          const result = await apiClient.post<PageResult<T>>(apiUrl, requestBody);

          // 3. อัปเดต State จาก Response (โค้ดส่วนนี้เหมือนเดิม)
          setData(result.data.items || []);
          setPageCount(result.data.pageCount || 0);

        } catch (error) {
          // Interceptor ได้จัดการ error ส่วนใหญ่ (เช่น log, redirect) ไปแล้ว
          // ที่นี่เราแค่จัดการ state ของ component นี้ให้ถูกต้องเมื่อเกิด error
          console.error("Error caught in useServerSideTable hook:", error);
          setData([]);
          setPageCount(0);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }

  }, [apiUrl, sorting, columnFilters, pagination, useMock, mockData]);

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

  // การคืนค่าไม่มีการเปลี่ยนแปลง
  return { table, isLoading };
};