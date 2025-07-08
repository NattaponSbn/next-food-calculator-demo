'use client';

import { useState, useEffect } from 'react';

/**
 * Custom Hook สำหรับทำ Debounce ค่าที่เปลี่ยนแปลงบ่อยๆ (เช่น ค่าจากช่องค้นหา, state ที่ซับซ้อน)
 * @template T - Type ของค่าที่ต้องการทำ Debounce
 * @param {T} value - ค่าที่ต้องการทำ Debounce (จาก state)
 * @param {number} delay - ระยะเวลาที่จะหน่วง (หน่วยเป็นมิลลิวินาที)
 * @returns {T} - ค่าล่าสุดหลังจากที่ไม่มีการเปลี่ยนแปลงตามระยะเวลาที่กำหนด
 */
export function useDebounce<T>(value: T, delay: number): T {
  // 1. สร้าง State ภายในเพื่อเก็บค่าที่ถูก Debounce แล้ว
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 2. สร้าง Timer ขึ้นมาทุกครั้งที่ `value` (ค่าดั้งเดิม) หรือ `delay` เปลี่ยนแปลง
    const handler = setTimeout(() => {
      // 3. เมื่อ Timer ทำงานครบตามเวลา (delay),
      //    ให้อัปเดต `debouncedValue` ด้วยค่าล่าสุดของ `value`
      setDebouncedValue(value);
    }, delay);

    // 4. Cleanup Function: สำคัญมาก!
    //    ฟังก์ชันนี้จะทำงานทุกครั้งก่อนที่ useEffect จะรันใหม่ หรือเมื่อ Component unmount
    //    เพื่อ "ยกเลิก" Timer ตัวเก่าที่ยังไม่ทำงาน
    //    ป้องกันไม่ให้ state ถูกอัปเดตด้วยค่าเก่าที่ค้างอยู่
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // 5. ให้ useEffect ทำงานใหม่เฉพาะเมื่อ `value` หรือ `delay` เปลี่ยน

  // 6. คืนค่าที่ถูก Debounce แล้วออกไปให้ Component ใช้งาน
  return debouncedValue;
}