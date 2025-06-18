// types/api.ts

// 1. Type สำหรับข้อมูลแต่ละรายการใน 'items'
// T คือ Generic Type ที่จะแทนข้อมูลแต่ละแถว เช่น Provider, Policy, etc.
export interface PageResult<T> {
  _kind: string;
  pageNumber: number;
  totalItemCount: number;
  pageCount: number;
  pageSize: number;
  items: T[];
}

// 2. Type สำหรับ object 'sort' ใน Request Body
export interface SortCriteria {
  column: string;
  direction: 'asc' | 'desc';
}

// 3. Type สำหรับ object 'criteria' ใน Request Body
// ใช้ Index Signature เพื่อรองรับ key ที่เป็น string ใดๆ
export interface FilterCriteria {
  [key: string]: any; 
}

// 4. Type สำหรับ Request Body ทั้งหมด
export interface ApiSearchRequest {
  pageNumber: number;
  pageSize: number;
  criteria: FilterCriteria;
  sort?: SortCriteria;
}