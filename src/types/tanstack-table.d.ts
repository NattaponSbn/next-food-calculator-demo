// types/tanstack-table.d.ts

import '@tanstack/react-table'; // สำคัญมาก: ต้อง import ก่อนเพื่อบอกว่าจะ Augment module นี้

// เราจะทำการ "ประกาศ" (declare) เพื่อ "รวม" (merge) Type ของเราเข้าไปใน Module เดิม
declare module '@tanstack/react-table' {
  // ขยาย Interface 'ColumnMeta'
  interface ColumnMeta<TData extends RowData, TValue> {
    // เพิ่ม property ของเราเข้าไปที่นี่
    filterType?: 'text' | 'status' | 'date' | 'numberRange'; // กำหนดประเภทที่เป็นไปได้
  }
}