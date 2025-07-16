'use client';

import { useThemeMode } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Button } from 'flowbite-react'; // หรือใช้ <button> ธรรมดา

export const ThemeToggleButton = () => {
  // 1. ใช้ hook จาก Flowbite เพื่อจัดการ theme
  const { mode, toggleMode } = useThemeMode();

  return (
    // 2. ใช้ Button ของ Flowbite หรือ <button> ธรรมดา
    //    `pill` prop ทำให้ปุ่มเป็นวงกลม
    <Button
      color="gray"
      pill
      onClick={toggleMode} // 3. เรียกใช้ฟังก์ชันสลับโหมดเมื่อคลิก
      className="focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
      aria-label="Toggle dark mode"
    >
      {/* 4. ใช้เงื่อนไขเพื่อแสดงไอคอนที่ถูกต้อง */}
      {mode === 'dark' ? (
        <Icon icon="solar:sun-bold-duotone" className="h-5 w-5" /> // ไอคอนพระอาทิตย์
      ) : (
        <Icon icon="solar:moon-bold-duotone" className="h-5 w-5" /> // ไอคอนพระจันทร์
      )}
    </Button>
  );
};