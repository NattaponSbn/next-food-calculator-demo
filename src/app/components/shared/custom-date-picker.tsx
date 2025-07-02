'use client';

import { formatDateForDisplay, formatDateForInput, parseDateFromInput } from '@/app/lib/date-helpers';
import { Datepicker, type DatepickerProps } from 'flowbite-react';

/**
 * กำหนด Props สำหรับ Component กลางของเรา
 * - เราจะรับ Props ทั้งหมดของ Datepicker เดิม
 * - แต่จะจัดการ `value` และ `onSelectedDateChanged` เอง
 */
interface CustomDatePickerProps extends Omit<DatepickerProps, 'value' | 'onSelectedDateChanged'> {
  /**
   * ค่าวันที่ที่ Component จะรับและส่งออกไป
   * อยู่ในรูปแบบ string มาตรฐาน 'yyyy-MM-dd' หรือ null
   */
  value: string | null;
  /**
   * Callback function ที่จะทำงานเมื่อผู้ใช้เลือกวันที่
   * จะส่งค่าวันที่กลับมาเป็น string 'yyyy-MM-dd'
   */
  onDateChange: (dateString: string | null) => void;
}

/**
 * Component กลางสำหรับ Datepicker ของ Flowbite
 * ที่ช่วยจัดการ format วันที่ให้ง่ายต่อการใช้งาน
 */
export const CustomDatePicker = ({ 
  value, 
  onDateChange, 
  ...rest // รับ props ที่เหลือทั้งหมด (เช่น minDate, maxDate, placeholder, color)
}: CustomDatePickerProps) => {

  // 1. แปลงค่า string 'yyyy-MM-dd' ที่รับเข้ามา ให้เป็น Date object
  //    เพื่อให้ Datepicker ของ Flowbite สามารถนำไปแสดงผลได้
  const selectedDateObject = parseDateFromInput(value);

  // 2. สร้างฟังก์ชันที่จะถูกเรียกเมื่อผู้ใช้เลือกวันที่ในปฏิทิน
  const handleDateSelected = (date: Date) => {
    // 3. แปลง Date object ที่ได้จากปฏิทิน กลับเป็น string 'yyyy-MM-dd'
    const dateString = formatDateForInput(date);
    // 4. ส่งค่า string ที่ได้มาตรฐานกลับไปให้ Component แม่ผ่าน onDateChange
    onDateChange(dateString);
  };

  return (
    <div id="flowbite-datepicker">
     <Datepicker
      // Flowbite ต้องการ value ที่เป็น string รูปแบบ 'Month D, YYYY' หรือปล่อยว่าง
      // เราใช้ .toDateString() เพื่อแปลงให้ง่ายที่สุด
      className='form-control form-rounded-xl'
      value={formatDateForDisplay(selectedDateObject)}
      onSelectedDateChanged={handleDateSelected}
      // ----- ส่วนของการตั้งค่ากลาง ที่จะเหมือนกันทุกที่ -----
      language="th"
      labelTodayButton="วันนี้"
      labelClearButton="ล้าง"
      weekStart={1} // เริ่มสัปดาห์ที่วันจันทร์
      // --------------------------------------------------
      {...rest} // ส่ง props ที่เหลือทั้งหมดเข้าไป เช่น color, minDate, maxDate
    />
    </div>
   
  );
};