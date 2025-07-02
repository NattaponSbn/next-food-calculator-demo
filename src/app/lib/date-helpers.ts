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

// --- [เพิ่มใหม่] ฟังก์ชันสำหรับจัดการ Form Input ---

/**
 * จัดรูปแบบวันที่ให้เป็น string 'yyyy-MM-dd' เพื่อใช้กับ HTML input type="date"
 * 
 * @param dateInput - ค่าวันที่ที่รับเข้ามา (Date, string, or number)
 * @returns {string | null} - วันที่ในรูปแบบ 'yyyy-MM-dd' หรือ null ถ้า input ไม่ถูกต้อง
 */
export const formatDateForInput = (dateInput: Date | string | number | null | undefined): string | null => {
  if (!dateInput) return null;

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return null;
    }
    // ดึงค่าปี, เดือน, วัน ออกมาแล้วประกอบใหม่
    // ต้องบวก 1 ให้เดือนเพราะ getMonth() คืนค่า 0-11
    // padStart(2, '0') เพื่อให้มีเลข 0 นำหน้าเสมอ (เช่น 01, 09)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return null;
  }
};

/**
 * แปลงค่า string 'yyyy-MM-dd' จาก input ให้เป็น Date object
 * 
 * @param dateString - วันที่ในรูปแบบ 'yyyy-MM-dd'
 * @returns {Date | null} - Date object หรือ null ถ้า input ไม่ถูกต้อง
 */
export const parseDateFromInput = (dateString: string | null | undefined): Date | null => {
    if (!dateString) return null;

    // Regex เพื่อตรวจสอบ format yyyy-mm-dd
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return null;
    }

    try {
        const date = new Date(dateString);
        // เพิ่มการตรวจสอบ getTime() อีกครั้งเพื่อความปลอดภัย
        if (isNaN(date.getTime())) {
            return null;
        }
        return date;
    } catch (error) {
        console.error('Error parsing date from input:', error);
        return null;
    }
};

/**
 * จัดรูปแบบวันที่สำหรับการแสดงผลใน UI (DD/MM/YYYY)
 * 
 * @param dateInput - ค่าวันที่ที่รับเข้ามา (Date, string, or number)
 * @returns {string} - วันที่ในรูปแบบ 'DD/MM/YYYY' หรือ string ว่างถ้า input ไม่ถูกต้อง
 */
export const formatDateForDisplay = (dateInput: Date | string | number | null | undefined): string => {
  if (!dateInput) return ''; // ถ้าไม่มีค่า ให้คืนค่าเป็น string ว่าง

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return ''; // ถ้าวันที่ไม่ถูกต้อง

    // ดึงค่าวัน, เดือน, ปี ออกมาแล้วจัดรูปแบบ
    const day = String(date.getDate()).padStart(2, '0'); // ทำให้เป็นเลข 2 หลักเสมอ
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนต้อง +1 และทำให้เป็น 2 หลัก
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
};