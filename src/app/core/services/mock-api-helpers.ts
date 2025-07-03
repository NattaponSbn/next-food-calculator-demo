// src/lib/mock/mock-api-helpers.ts

import type { ApiSearchRequest, PageResult } from '@/app/core/models/shared/page.model';

/**
 * Generic function สำหรับสร้าง "ฟังก์ชัน Fetch จำลอง" จากข้อมูล Mock ใดๆ
 * ที่รองรับการกรอง (แบบ text), การเรียงลำดับ, และการแบ่งหน้า
 *
 * @param mockData - Array ของข้อมูล Mock ที่จะใช้เป็นแหล่งข้อมูล
 * @returns ฟังก์ชันที่หน้าตาเหมือน API Service จริงๆ
 */
export const createMockFetchFn = <T extends Record<string, any>>(mockData: T[]) => {
  
  return (request: ApiSearchRequest): Promise<PageResult<T>> => {
    // แสดง Log ใน Console เพื่อให้รู้ว่ากำลังทำงานในโหมด Mock
    console.log("--- RUNNING IN MOCK MODE ---");
    console.log("Mock request received:", request);

    return new Promise(resolve => {
      // 1. จำลอง Network Delay เพื่อให้เหมือนการเรียก API จริง
      setTimeout(() => {
        let items = [...mockData]; // คัดลอก Array เพื่อไม่ให้กระทบข้อมูลตั้งต้น

        // 2. จำลองการกรองข้อมูล (Filtering) - แบบ Text-based
        if (request.criteria && Object.keys(request.criteria).length > 0) {
          Object.entries(request.criteria).forEach(([key, value]) => {
            // กรองเฉพาะค่าที่ไม่ใช่ null, undefined หรือ string ว่าง
            if (value !== null && value !== undefined && value !== '') {
              const filterValue = String(value).toLowerCase();
              items = items.filter(item => {
                const itemValue = item[key as keyof T];
                // ตรวจสอบว่า item มี key นั้น และค่าของมัน (แปลงเป็น string) มีส่วนของ filterValue อยู่
                return itemValue !== null && itemValue !== undefined && String(itemValue).toLowerCase().includes(filterValue);
              });
            }
          });
        }
        
        // 3. จำลองการเรียงลำดับ (Sorting)
        if (request.sort) {
          const { column, direction } = request.sort;
          items.sort((a, b) => {
            const valA = a[column as keyof T];
            const valB = b[column as keyof T];

            // จัดการกรณีที่ค่าเป็น null หรือ undefined
            if (valA == null) return 1;
            if (valB == null) return -1;

            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
          });
        }
        
        // 4. จำลองการแบ่งหน้า (Pagination)
        const totalItems = items.length;
        const pageSize = request.pageSize;
        const pageCount = Math.ceil(totalItems / pageSize);
        const pageNumber = request.pageNumber;

        const startIndex = (pageNumber - 1) * pageSize;
        const paginatedItems = items.slice(startIndex, startIndex + pageSize);

        // 5. สร้างผลลัพธ์ (Response) ที่มีโครงสร้างเหมือนกับ API จริง
        const result: PageResult<T> = {
          items: paginatedItems,
          pageNumber: pageNumber,
          pageSize: pageSize,
          totalItemCount: totalItems,
          pageCount: pageCount,
        };
        
        console.log("Mock response sent:", result);
        resolve(result);

      }, 500); // Delay 500 มิลลิวินาที
    });
  };
};