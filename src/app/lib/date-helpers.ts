// utils/date-helpers.ts

// --- 1. ฟังก์ชันกลางที่ยืดหยุ่นที่สุด ---

/**
 * จัดรูปแบบวันที่และเวลาตาม Locale ที่กำหนด
 * 
 * @param dateInput - ค่าวันที่ที่รับเข้ามา (Date, string, or number)
 * @param locale - Locale string (เช่น 'th-TH', 'en-US', 'en-GB')
 * @param options - ตัวเลือกเพิ่มเติมสำหรับการจัดรูปแบบ (Intl.DateTimeFormatOptions)
 * @returns {string} - วันที่ที่จัดรูปแบบแล้ว หรือ string ว่างถ้า input ไม่ถูกต้อง
 */
export const formatDateTime = (
  dateInput: Date | string | number,
  locale: string = 'th-TH', // 2. รับ locale และกำหนดค่าเริ่มต้นเป็น 'th-TH'
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string => {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return ''; 
    }
    // 3. ใช้ locale ที่รับเข้ามาในการจัดรูปแบบ
    return date.toLocaleString(locale, options);
  } catch (error) {
    console.error(`Error formatting date for locale ${locale}:`, error);
    return '';
  }
};


// --- 2. สร้างฟังก์ชันย่อยสำหรับภาษาไทย (TH) ---

/**
 * จัดรูปแบบเฉพาะ "วันที่" แบบสั้นสำหรับภาษาไทย (DD/MM/YYYY)
 */
export const formatDateThaiShort = (dateInput: Date | string | number): string => {
  return formatDateTime(dateInput, 'th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};


// --- 3. [เพิ่มใหม่] สร้างฟังก์ชันย่อยสำหรับภาษาอังกฤษ (EN) ---

/**
 * จัดรูปแบบเฉพาะ "วันที่" แบบสั้นสำหรับภาษาอังกฤษ (US format: MM/DD/YYYY)
 */
export const formatDateEngShort = (dateInput: Date | string | number): string => {
  return formatDateTime(dateInput, 'en-US', { // ใช้ 'en-US' locale
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * จัดรูปแบบวันที่แบบยาวสำหรับภาษาอังกฤษ (เช่น Oct 28, 2023)
 */
export const formatDateEngLong = (dateInput: Date | string | number): string => {
    return formatDateTime(dateInput, 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * จัดรูปแบบวันที่และเวลาแบบยาวสำหรับภาษาอังกฤษ
 */
export const formatDateTimeEng = (dateInput: Date | string | number): string => {
    return formatDateTime(dateInput, 'en-US'); // ใช้ options เริ่มต้น
}